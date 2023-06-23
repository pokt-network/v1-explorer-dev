// Example:
//
// http :3000/api/network-parameters/read-yaml
//
import { NextApiRequest, NextApiResponse } from 'next';
import { readOrCreateYamlConfigMap } from '~/server/kubernetes';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await readOrCreateYamlConfigMap();
    res.status(200).send(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err });
  }
};

export default handler;
