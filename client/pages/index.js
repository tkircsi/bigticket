import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // call another service in another namespace in the cluster
    // http://SERVICENAME.NAMESPACE.svc.cluster.local
    // Headers must be set according the ingress service Path rules
    const response = await axios(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return response.data;
  } else {
    // we are on the browser
    const response = await axios('/api/users/currentuser');
    return response.data;
  }
  return {};
};

export default LandingPage;
