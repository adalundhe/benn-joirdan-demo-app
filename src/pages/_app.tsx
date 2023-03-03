import { type AppType } from "next/app";

import "~/styles/globals.css";

const SongSubmissionApp: AppType = ({
  Component,
  pageProps: {...pageProps },
}) => {
  return (
    <Component {...pageProps} />
  );
};

export default SongSubmissionApp;
