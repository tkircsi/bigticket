import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
  const [doRequest, errors] = useRequest({
    url: '/api/users/signout',
    method: 'get',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out....</div>;
};
