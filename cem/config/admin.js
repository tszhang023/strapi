module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f673434d8a9b15177bf1609a8358376b'),
  },
});
