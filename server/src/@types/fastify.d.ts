import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      avatarUrl: string;
      name: string;
      sub: string;
    }
  }
}