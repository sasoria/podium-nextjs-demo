import Document, { Html, Head, Main, NextScript } from "next/document";
import Layout from "@podium/layout";
import utils from "@podium/utils";

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
        return utils.buildLinkElement(podlet.css[0]);
      }
    });

    const js = podlets.map((podlet) => {
      if (Object.keys(podlet.js).length !== 0) {
        return utils.buildScriptElement(podlet.js[0]);
      }
    });

    return (
      <Html>
        <Head>{css}</Head>
        <body>
          <Main />
          <section>
            <div id="podlet-a"></div>
            {podlets[0].content}
            {podlets[1].content}
            {podlets[2].content}
          </section>
          <NextScript />
          {js}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
