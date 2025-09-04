import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ALLOWED_ADMIN_EMAILS, ALLOWED_ADMIN_PASSWORDS } from './constants/admin-lists';

@Injectable()
export class AuthService {
  /**
   * Règle imposée :
   *  - Email ∈ liste_emails_autorisés
   *  - MotDePasse ∈ liste_mdp_autorisés
   *  -> PAS d'association email↔mdp.
   */
  async validateAdmin(email: string, password: string) {
    const emailOk = ALLOWED_ADMIN_EMAILS.includes(email);
    const passwordOk = ALLOWED_ADMIN_PASSWORDS.includes(password);

    if (!emailOk || !passwordOk) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Tu peux retourner un payload minimal pour le front
    return {
      success: true,
      user: { email },
    };
  }
}
