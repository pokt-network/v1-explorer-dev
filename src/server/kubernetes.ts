/**
 * Instantiates a single instance of KubernetesClient and save it on the global object.
 * @link https://github.com/godaddy/kubernetes-client
 */
import { env } from './env';
import * as k8s from '@kubernetes/client-node';

const kubeConfigGlobal = global as typeof global & {
  kubeConfig: k8s.KubeConfig;
};

const config = new k8s.KubeConfig();
config.loadFromDefault();

const namespace = env.KUBERNETES_NAMESPACE;
const name = env.NETWORK_PARAMETERS_CM_NAME;
const DEFAULT_VALUES = {
  validators: {
    count: 4,
  },
  full_nodes: {
    count: 1,
  },
  fishermen: {
    count: 1,
  },
  servicers: {
    count: 1,
  },
};

// env.NODE_ENV === 'development'
//   ? config.loadFromDefault()
//   : config.loadFromCluster();

export const kubeConfig: k8s.KubeConfig = kubeConfigGlobal.kubeConfig || config;

if (env.NODE_ENV !== 'production') {
  kubeConfigGlobal.kubeConfig = kubeConfig;
}

export const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

export const readOrCreateNetworkParametersConfigMap = async () => {
  try {
    const cm = await k8sApi.readNamespacedConfigMap(name, namespace);
    return cm.body.data && cm.body.data['network-parameters'];
    // If id doesn't exist, create with default values
  } catch (error) {
    const err = error as Error & { response?: { statusCode?: number } };
    if (err.response && err.response.statusCode === 404) {
      try {
        const payload = {
          metadata: {
            name,
            namespace,
          },
          data: {
            'network-parameters': JSON.stringify(DEFAULT_VALUES, null, 2),
          },
        };
        const newCM = await k8sApi.createNamespacedConfigMap(
          namespace,
          payload,
        );
        return newCM.body.data && newCM.body.data['network-parameters'];
      } catch (createErr) {
        throw createErr;
      }
    } else {
      throw err;
    }
  }
};

export const writeNetworkParametersConfigMap = async (newParams: any) => {
  // Make sure the config map exists
  const currentParameters = await readOrCreateNetworkParametersConfigMap();
  if (!currentParameters) {
    throw new Error(
      'Could not read network parameters config map, and could not create it either',
    );
  }
  const currentParametersJson = JSON.parse(currentParameters);
  const newParamsJson = JSON.parse(newParams);
  const newParametersJson = { ...currentParametersJson, ...newParamsJson };
  // console.log(currentParametersJson);
  // console.log(newParamsJson);
  // console.log(newParametersJson);

  const k8sres = await k8sApi.patchNamespacedConfigMap(
    name,
    namespace,
    [
      {
        op: 'replace',
        path: '/data/network-parameters',
        value: JSON.stringify(newParametersJson, null, 2),
      },
    ],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { headers: { 'Content-Type': 'application/json-patch+json' } },
  );
  console.log(k8sres.body);
  return k8sres.body.data && k8sres.body.data['network-parameters'];
};
