import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { cron } from "@elysiajs/cron";
import { hmr } from "@gtrabanco/elysia-hmr-html";
import { join } from "node:path";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use((app) =>
    process.env.NODE_ENV === "development"
      ? app.use(swagger({ path: "/swagger" }))
      : app
  )
  .use(
    hmr({
      prefixToWatch: join(__dirname, "../../frontend/dist"),
    })
  )
  .use(
    staticPlugin({
      assets: join(__dirname, "../../frontend/dist"),
      prefix: "",
    })
  )
  .onParse(async ({ request }, contentType) => {
    if (contentType === "application/json") {
      const data = await request.json();
      return {
        name: data.name,
        address: data.address,
      };
    }
  })
  .get("/", () => {
    return Bun.file(join(__dirname, "../../frontend/dist/index.html"));
  })
  .get("/whitelist", () => {
    return Bun.file(join(__dirname, "../../frontend/dist/index.html"));
  })
  .post(
    "/submit",
    async ({ body }: { body: { name: string; address: string } }) => {
      const { name, address } = body;
      const storagePath = `${__dirname}/storage.json`;
      const file = Bun.file(storagePath);

      const fileExists = await file.exists();
      if (!fileExists) {
        console.log("File does not exist, creating a new one");
        await Bun.write(storagePath, JSON.stringify([]));
      }
      const currentData = JSON.parse(await Bun.file(storagePath).text());

      currentData.push({ name: name, address: address });

      await Bun.write(storagePath, JSON.stringify(currentData, null, 2));

      return { success: true, message: "Saved" };
    },
    {
      detail: {
        tags: ["Form Submission"],
        requestBody: {
          description: "Name and address to save",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nickname",
                  },
                  address: {
                    type: "string",
                    description: "Address",
                  },
                },
                required: ["name", "address"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Data successfully saved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  .use(
    cron({
      name: "uploadScheduler",
      pattern: "20 4 */12 * *",
      run: async () => {
        const path = `${__dirname}/storage.json`;
        const file = Bun.file(path);
        const form = new FormData();
        form.append("files", file);

        const response = await fetch("https://v1.stratuscloud.xyz/api/u", {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.API_KEY}:${process.env.API_SECRET}`
            )}`,
          },
        });
        console.log("Response status: ", response.status);
      },
    })
  )
  .post(
    "/upload",
    async () => {
      const path = `${__dirname}/storage.json`;
      console.log(path);

      const file = Bun.file(path);
      const form = new FormData();
      form.append("files", file);

      const response = await fetch("https://v1.stratuscloud.xyz/api/u", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.API_KEY}:${process.env.API_SECRET}`
          )}`,
        },
      });

      const json = await response.json();
      return json;
    },
    {
      detail: {
        tags: ["File"],
        requestBody: {
          description: "File to upload",
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "File successfully uploaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  .get(
    "/download/:fileId",
    async ({ params: { fileId } }) => {
      const response = await fetch(
        `https://v1.stratuscloud.xyz/api/d/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.API_KEY}:${process.env.API_SECRET}`
            )}`,
          },
        }
      );

      const clonedResponse = response.clone();
      const file = await response.blob();
      const buffer = Buffer.from(await file.arrayBuffer());
      await Bun.write(`../${fileId}`, buffer);

      const data = await clonedResponse.json();
      return data;
    },
    {
      detail: {
        tags: ["File"],
        responses: {
          "200": {
            description:
              "File successfully retrieved and data returned in JSON format",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  .get(
    "/storage",
    async () => {
      const storagePath = `${__dirname}/storage.json`;
      const data = JSON.parse(await Bun.file(storagePath).text());
      return data;
    },
    {
      detail: {
        tags: ["Storage"],
        summary: "Get internal data",
        description: "This route returns the content of the file",
        responses: {
          "200": {
            description: "Successful data retrieval",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                    description: "Address for each name",
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  .listen(process.env.PORT || 3000, ({ hostname, port }) => {
    console.log(`Elysia server started at http://${hostname}:${port}`);
  });
