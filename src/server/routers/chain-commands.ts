import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { kubeConfig } from '../kubermetes';
import * as stream from 'stream';
import * as k8s from '@kubernetes/client-node';
import { env } from '../env';

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

export const chainCommandsRouter = router({
  executeCommand: publicProcedure
    .input(
      z.object({
        commandName: z.string(), // TODO: should be enum checking `allowedCommands`
      }),
    )
    .mutation(async ({ input }) => {
      const { commandName } = input;
      const pods = await listFn(debugCliPodSelector);

      // Get all the pods in the given namespace that match the provided label
      if (pods.body.items.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No pods found with label ${debugCliPodSelector}`,
        });
      }

      const podName = pods.body.items[0]?.metadata?.name;
      if (!podName) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Pod with a label ${debugCliPodSelector} found, but has no name (should never happen)`,
        });
      }

      // const command = "/bin/bash -c 'ls -la'";
      // const command = '/usr/local/bin/p1 debug ' + commandName;
      const command = ['p1', 'debug', commandName];

      const exec = new k8s.Exec(kubeConfig);

      const stdoutStream = new stream.PassThrough();
      const stderrStream = new stream.PassThrough();

      let stdout = '';
      let stderr = '';

      stdoutStream.on('data', (chunk) => {
        stdout += chunk.toString();
      });
      stderrStream.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      try {
        const result = await new Promise<k8s.V1Status>((resolve, reject) => {
          const ws = exec
            .exec(
              namespace,
              podName,
              debugCliPodContainerName,
              command,
              stdoutStream,
              stderrStream,
              process.stdin as stream.Readable,
              true /* tty */,
              (status: k8s.V1Status) => {
                // tslint:disable-next-line:no-console
                console.log('Exited with status:');
                // tslint:disable-next-line:no-console
                console.log(JSON.stringify(status, null, 2));
                resolve(status);
              },
            )
            .catch((e) => {
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
                JSON.stringify({
                  message: e.message,
                  stack: e.stack,
                  code: e.code,
                  body: e.body,
                  status: e.status,
                  statusText: e.statusText,
                  headers: e.headers,
                }),
              );
            });
        });

        // k8sApi
        // const r = await k8sApi.connectPostNamespacedPodExec(podName, namespace, command.join(' '), debugCliPodContainerName, true, true, true, true)
        // console.log(JSON.stringify(r, null, 2))
        return { result, stdout, stderr };
      } catch (e) {
        console.log(JSON.stringify(e, null, 2));
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error executing command: ${e}`,
        });
      }
    }),
});
