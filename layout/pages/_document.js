import Document, { Html, Head, Main, NextScript } from "next/document";
import Layout from "@podium/layout";
import parse from "html-react-parser";
import { parseCssAssetsToReactHtml } from "../src/utils";
import { parseJsAssetsToReactHtml } from "../src/utils";

const layout = new Layout({
  name: "Layout",
  pathname: "/",
  development: true,
  logger: console,
});

const podletA = layout.client.register({
  name: "podlet-a",
  uri: "http://localhost:7100/manifest.json",
});

const podletB = layout.client.register({
  name: "podlet-b",
  uri: "http://localhost:7200/manifest.json",
});

const podletC = layout.client.register({
  name: "podlet-c",
  uri: "http://localhost:7300/manifest.json",
});

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const podlets = await Promise.all([
      podletA.fetch(),
      podletB.fetch(),
      podletC.fetch(),
    ]);

    return { ...initialProps, podlets };
  }

  render() {
    const podlets = this.props.podlets;
    const css = parseCssAssetsToReactHtml(podlets);
    const js = parseJsAssetsToReactHtml(podlets);

    return (
      <Html>
        <Head>{css}</Head>
        <body>
          <Main />
          <section>
            {parse(podlets[0].content)}
            {parse(podlets[1].content)}
            {parse(podlets[2].content)}
          </section>
          {js}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
