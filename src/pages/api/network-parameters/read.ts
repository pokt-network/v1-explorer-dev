// Example:
//
// ❯ http :3000/api/network-parameters/read
// HTTP/1.1 200 OK
// connection: close
// date: Fri, 30 Jun 2023 00:15:19 GMT
// etag: "9q4psabfcc48"
// keep-alive: timeout=5
// transfer-encoding: chunked
// {
//   "validators": {
//     "count": 4
//   },
//   "full_nodes": {
//     "count": 1
//   },
//   "fishermen": {
//     "count": 1
//   },
//   "servicers": {
//     "count": 3
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { readOrCreateNetworkParametersConfigMap } from '~/server/kubernetes';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await readOrCreateNetworkParametersConfigMap();
    res.status(200).send(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err });
  }
};

export default handler;
