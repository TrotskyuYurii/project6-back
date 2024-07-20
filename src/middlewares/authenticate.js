import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessionModel.js';
import { UsersCollection } from '../db/models/userModel.js';


export default async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, getLocalizedMessage('authorizationHeaderMissing')));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, getLocalizedMessage('authHeaderInvalid')));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, getLocalizedMessage('sessionNotFound')));
  }

  if (session.accessTokenValidUntil < Date.now()) {
    return next(createHttpError(401, getLocalizedMessage('accessTokenExpired')));
  }

  const user = await UsersCollection.findOne({ _id: session.userId });
  if (!user) {
    return next(createHttpError(401, getLocalizedMessage('userNotFound')));
  }

  req.user = user;

  next();
}
