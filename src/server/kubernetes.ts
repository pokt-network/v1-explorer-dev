/**
 * Instantiates a single instance of KubernetesClient and save it on the global object.
 * @link https://github.com/godaddy/kubernetes-client
 */
import { env } from './env';
import * as k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import * as https from 'https';

const kubeConfigGlobal = global as typeof global & {
  kubeConfig: k8s.KubeConfig;
};

const PARAMETERS_DEFAULTS_URL =
  'https://v1-networks-parameters.dev-us-east4-1.poktnodes.network:8443/defaults';

const config = new k8s.KubeConfig();
config.loadFromDefault();

// env.NODE_ENV === 'development'
//   ? config.loadFromDefault()
//   : config.loadFromCluster();

export const kubeConfig: k8s.KubeConfig = kubeConfigGlobal.kubeConfig || config;

if (env.NODE_ENV !== 'production') {
  kubeConfigGlobal.kubeConfig = kubeConfig;
}

export const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
export const readOrCreateYamlConfigMap = async () => {
  const namespace = env.KUBERNETES_NAMESPACE;
  const name = env.NETWORK_PARAMETERS_CM_NAME;

  try {
    const cm = await k8sApi.readNamespacedConfigMap(name, namespace);
    return cm.body.data && cm.body.data['network-parameters'];
  } catch (error) {
    const err = error as Error & { response?: { statusCode?: number } };
    // console.log('error on `readNamespacedConfigMap`', err.response);
    if (err.response && err.response.statusCode === 404) {
      // Get default values
      const body = await new Promise<string>((resolve, reject) => {
        https.get(PARAMETERS_DEFAULTS_URL, (res) => {
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            resolve(body);
          });

          res.on('error', reject);
        });
      });

      try {
        const payload = {
          metadata: {
            name,
            namespace,
          },
          data: {
            'network-parameters': body,
          },
        };
        console.log(JSON.stringify(payload));
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
