FROM oven/bun:1.3.1-alpine

WORKDIR ./app/apps/ws

COPY . .

RUN bun install

RUN cd packages/db && bunx prisma generate && cd  ../..


EXPOSE 3001

CMD [ "bun"," run","strat:ws" ]