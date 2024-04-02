import { useRouter } from "next/router";
import { useEffect } from "react";
import session, { sessionStatus } from "../utils/session";
import { redirect } from "next/navigation";

const withAuth = (WrappedComponent) => {
  return function Wrapper(props) {
    const session = sessionStatus;
    useEffect(() => {
      if (!session) {
        redirect("/");
      }
    }, []);

    if (!session) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
