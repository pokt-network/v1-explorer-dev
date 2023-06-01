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

env.NODE_ENV === 'development'
  ? config.loadFromDefault()
  : config.loadFromCluster();

export const kubeConfig: k8s.KubeConfig = kubeConfigGlobal.kubeConfig || config;

if (env.NODE_ENV !== 'production') {
  kubeConfigGlobal.kubeConfig = kubeConfig;
}
