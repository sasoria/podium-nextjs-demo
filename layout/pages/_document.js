import Document, { Html, Head, Main, NextScript } from "next/document";
import Layout from "@podium/layout";
import utils from "@podium/utils";
import parse from "html-react-parser";

const layout = new Layout({
  name: "Layout",
  pathname: "/",
  development: true,
  logger: console,
});

const podletA = layout.client.register({
  name: "podlet-a",
  uri: "http://localhost:7100/manifest.json",
  resolveJs: true,
  resolveCss: true,
});

const podletB = layout.client.register({
  name: "podlet-b",
  uri: "http://localhost:7200/manifest.json",
  resolveJs: true,
  resolveCss: true,
});

const podletC = layout.client.register({
  name: "podlet-c",
  uri: "http://localhost:7300/manifest.json",
  resolveJs: true,
  resolveCss: true,
});

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const incoming = {};
    const podlets = await Promise.all([
      podletA.fetch(incoming),
      podletB.fetch(incoming),
      podletC.fetch(incoming),
    ]);

    return { ...initialProps, podlets };
  }

  render() {
    const podlets = this.props.podlets;

    const css = podlets.map((podlet) => {
      if (Object.keys(podlet.css).length !== 0) {
        return parse(utils.buildLinkElement(podlet.css[0]));
      }
    });

    const js = podlets.map((podlet) => {
      if (Object.keys(podlet.js).length !== 0) {
        return parse(utils.buildScriptElement(podlet.js[0]));
      }
    });

    const content = podlets.map((podlet) => {
      if (Object.keys(podlet.js).length !== 0) {
        return parse(podlet.content);
      }
    });

    return (
      <Html>
        <Head>{css}</Head>
        <body>
          <Main />
          <section>{content}</section>
          {js}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
