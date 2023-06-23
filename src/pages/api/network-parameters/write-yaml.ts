// Example:
//
// http -vvvv :3000/api/network-parameters/write-yaml network-parameters="fishermen:
//   count: 2
// full_nodes:
//   count: 1
// servicers:
//   count: 1
// validators:
//   count: 4
// "
//

import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/server/env';
import { kubeConfig, readOrCreateYamlConfigMap } from '~/server/kubernetes';
import * as k8s from '@kubernetes/client-node';

const namespace = env.KUBERNETES_NAMESPACE;
const networkParametersConfigMapName = env.NETWORK_PARAMETERS_CM_NAME;
const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Make sure the config map exists
    await readOrCreateYamlConfigMap();

    const k8sres = await k8sApi.patchNamespacedConfigMap(
      networkParametersConfigMapName,
      namespace,
      [
        {
          op: 'replace',
          path: '/data/network-parameters',
          value: req.body['network-parameters'],
        },
      ],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { headers: { 'Content-Type': 'application/json-patch+json' } },
    );

    res
      .status(200)
      .send(k8sres.body.data && k8sres.body.data['network-parameters']);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err });
  }
};

export default handler;
