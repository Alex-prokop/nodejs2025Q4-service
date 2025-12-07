FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:24-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev --omit=optional \
  && npm cache clean --force \
  && rm -rf /root/.npm /tmp/* /var/cache/apk/* \
  && find node_modules -type d \( \
      -name "test" -o -name "tests" -o -name "__tests__" -o \
      -name "example" -o -name "examples" -o \
      -name "demo" -o -name "demos" -o \
      -name "benchmark" -o -name "benchmarks" -o \
      -name "coverage" \
     \) -prune -exec rm -rf '{}' + \
  && find node_modules -type f \( \
      -name "*.md" -o -name "*.markdown" -o -name "*.mdx" -o \
      -name "LICENSE" -o -name "LICENSE.*" -o -name "CHANGELOG*" -o \
      -name "*.map" -o -name "*.tsbuildinfo" -o \
      -name "*.coffee" -o -name "*.log" \
     \) -delete \
  && rm -rf node_modules/typescript \
  && find node_modules/@prisma -type f \( \
      -name "*darwin*" -o -name "*win32*" -o -name "*windows*" \
     \) -delete \
  && rm -rf /usr/local/lib/node_modules/npm \
            /usr/local/lib/node_modules/corepack \
            /usr/local/bin/npm \
            /usr/local/bin/npx \
            /usr/local/bin/corepack


COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/doc ./doc

ENV NODE_ENV=production
ENV PORT=4000


CMD ["node", "dist/src/main.js"]

