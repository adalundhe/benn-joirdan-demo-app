import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "~/styles/globals.css";

const SongSubmissionApp: AppType = ({
  Component,
  pageProps: {...pageProps },
}) => {
  return (
    <Component {...pageProps} />
  );
};

export default api.withTRPC(SongSubmissionApp);
