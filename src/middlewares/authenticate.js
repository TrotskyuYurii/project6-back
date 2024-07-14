import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessionModel.js';
import { UsersCollection } from '../db/models/userModel.js';

export default async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (session.accessTokenValidUntil < Date.now()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findOne({ _id: session.userId });
  if (!user) {
    return next(
      createHttpError(401, 'User associated with this session was not found'),
    );
  }

  req.user = user;

  next();
}
