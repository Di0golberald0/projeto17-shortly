import jwt from 'jsonwebtoken';
import * as singRepository from '../repositories/signRepository.js';

export async function authMiddleware(req, res, next) {
  let token = req.headers?.authorization;
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await singRepository.getTokenByUserId(decoded.user);

    if (user.rowCount > 0) {
      console.log(user.rowCount);
      res.locals.user = user.rows[0];
      return next();
    }
    return res.status(500).send('Erro');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Erro');
  }
}