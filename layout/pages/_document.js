import Document, { Html, Head, Main, NextScript } from "next/document";
import Layout from "@podium/layout";

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
    return (
      <Html>
        <Head>
          <link
            href={podlets[0].css[0].value}
            type="text/css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <section>
            <div id="podlet-a"></div>
            {podlets[0].content}
            {podlets[1].content}
            {podlets[2].content}
          </section>
          <script src={podlets[0].js[0].value} type="module"></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
