import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // call another service in another namespace in the cluster
    // http://SERVICENAME.NAMESPACE.svc.cluster.local
    // Headers must be set according the ingress service Path rules
    return axios.create({
      baseURL:
        // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        'http://www.bigticket.xyz',
      headers: req.headers,
    });
  } else {
    // we are on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
