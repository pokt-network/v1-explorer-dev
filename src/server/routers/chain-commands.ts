import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  kubeConfig,
  readOrCreateNetworkParametersConfigMap,
  writeNetworkParametersConfigMap,
  writeNetworkParametersConfigMapValidation,
} from '../kubernetes';
import * as stream from 'stream';
import * as k8s from '@kubernetes/client-node';
import { env } from '../env';
import { spawn } from 'child_process';

const namespace = env.KUBERNETES_NAMESPACE;
const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
const listFn = (selector: string) =>
  k8sApi.listNamespacedPod(
    namespace,
    undefined,
    undefined,
    undefined,
    undefined,
    selector,
  );
const debugCliPodSelector = env.CLI_CLIENT_POD_SELECTOR;
const debugCliPodContainerName = 'pocket';

type ExecuteCommandReturnType = {
  result: number;
  stdout: string;
  stderr: string;
};

export const chainCommandsRouter = router({
  executeCommand: publicProcedure
    .input(
      z.object({
        commandName: z.string(), // TODO: should be enum checking `allowedCommands`
      }),
    )
    .mutation(async ({ input }): Promise<ExecuteCommandReturnType> => {
      const { commandName } = input;

      // Fetching all the pods in the given namespace that match the provided label
      const listPods = spawn('kubectl', [
        'get',
        'pods',
        '-l',
        debugCliPodSelector,
        '-o',
        'jsonpath={.items[0].metadata.name}',
        '-n',
        namespace,
      ]);

      return new Promise((resolve, reject) => {
        listPods.stdout.on('data', async (data) => {
          const podName = data.toString();

          if (!podName) {
            reject(
              new TRPCError({
                code: 'NOT_FOUND',
                message: `No pods found with label ${debugCliPodSelector}`,
              }),
            );
          }

          const command = ['p1', 'Debug', commandName];
          const execCmd = spawn('kubectl', [
            'exec',
            podName,
            '-n',
            namespace,
            '-c',
            debugCliPodContainerName,
            '--',
            ...command,
          ]);

          let stdout = '';
          let stderr = '';

          execCmd.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
          });

          execCmd.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
          });

          execCmd.on('exit', (code) => {
            console.log(`Exited with status: ${code}`);
            resolve({ result: code || -1, stdout, stderr });
          });

          execCmd.on('error', (e) => {
            console.log(
              'Error executing command: ' +
                JSON.stringify(
                  {
                    namespace,
                    podName,
                    debugCliPodContainerName,
                    command,
                    error: e,
                  },
                  null,
                  2,
                ),
            );

            reject(
              new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Error executing command: ${e}`,
              }),
            );
          });
        });

        listPods.stderr.on('data', (data) => {
          console.error(`Error listing pods: ${data}`);
          reject(
            new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Error listing pods: ${data}`,
            }),
          );
        });

        listPods.on('exit', (code) => {
          if (code !== 0) {
            reject(
              new TRPCError({
                code: 'NOT_FOUND',
                message: `No pods found with label ${debugCliPodSelector}`,
              }),
            );
          }
        });
      });
    }),

  // (async ({ input }) => {
  //   const { commandName } = input;
  //   const pods = await listFn(debugCliPodSelector);
  //
  //   // Get all the pods in the given namespace that match the provided label
  //   if (pods.body.items.length === 0) {
  //     throw new TRPCError({
  //       code: 'NOT_FOUND',
  //       message: `No pods found with label ${debugCliPodSelector}`,
  //     });
  //   }
  //
  //   const podName = pods.body.items[0]?.metadata?.name;
  //   if (!podName) {
  //     throw new TRPCError({
  //       code: 'INTERNAL_SERVER_ERROR',
  //       message: `Pod with a label ${debugCliPodSelector} found, but has no name (should never happen)`,
  //     });
  //   }
  //
  //   // const command = "/bin/bash -c 'ls -la'";
  //   // const command = '/usr/local/bin/p1 debug ' + commandName;
  //   const command = ['p1', 'debug', commandName];
  //
  //   const exec = new k8s.Exec(kubeConfig);
  //
  //   const stdoutStream = new stream.PassThrough();
  //   const stderrStream = new stream.PassThrough();
  //
  //   let stdout = '';
  //   let stderr = '';
  //
  //   stdoutStream.on('data', (chunk) => {
  //     stdout += chunk.toString();
  //   });
  //   stderrStream.on('data', (chunk) => {
  //     stderr += chunk.toString();
  //   });
  //
  //   try {
  //     const result = await new Promise<k8s.V1Status>((resolve, reject) => {
  //       // const ws =
  //       exec
  //         .exec(
  //           namespace,
  //           podName,
  //           debugCliPodContainerName,
  //           command,
  //           stdoutStream,
  //           stderrStream,
  //           process.stdin as stream.Readable,
  //           true /* tty */,
  //           (status: k8s.V1Status) => {
  //             // tslint:disable-next-line:no-console
  //             console.log('Exited with status:');
  //             // tslint:disable-next-line:no-console
  //             console.log(JSON.stringify(status, null, 2));
  //             resolve(status);
  //           },
  //         )
  //         .catch((e) => {
  //           console.log(
  //             'Error executing command: ' +
  //               JSON.stringify(
  //                 {
  //                   namespace,
  //                   podName,
  //                   debugCliPodContainerName,
  //                   command,
  //                   error: e,
  //                 },
  //                 null,
  //                 2,
  //               ),
  //           );
  //
  //           reject(
  //             JSON.stringify({
  //               message: e.message,
  //               stack: e.stack,
  //               code: e.code,
  //               body: e.body,
  //               status: e.status,
  //               statusText: e.statusText,
  //               headers: e.headers,
  //             }),
  //           );
  //         });
  //     });
  //
  //     // k8sApi
  //     // const r = await k8sApi.connectPostNamespacedPodExec(podName, namespace, command.join(' '), debugCliPodContainerName, true, true, true, true)
  //     // console.log(JSON.stringify(r, null, 2))
  //     return { result, stdout, stderr };
  //   } catch (e) {
  //     console.log(JSON.stringify(e, null, 2));
  //     throw new TRPCError({
  //       code: 'INTERNAL_SERVER_ERROR',
  //       message: `Error executing command: ${e}`,
  //     });
  //   }
  // })

  getCurrentScale: publicProcedure.query(
    readOrCreateNetworkParametersConfigMap,
  ),
  scaleActors: publicProcedure
    .input(writeNetworkParametersConfigMapValidation)
    .mutation(async ({ input }) => {
      console.log('input', input);
      return await writeNetworkParametersConfigMap(input);
    }),
});
