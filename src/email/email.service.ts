import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  sendRTRNotification(
    candidateEmail: string,
    candidateName: string,
    recruiterName: string,
    companyName: string,
    jobTitle: string,
    rtrId: string,
    approvalUrl: string,
    expiresAt?: Date,
  ): void {
    try {
      this.logger.log(`Sending RTR notification email to: ${candidateEmail}`);
      this.logger.log(`RTR ID: ${rtrId}`);
      this.logger.log(`Approval URL: ${approvalUrl}`);
      this.logger.log(`Expires at: ${expiresAt?.toDateString() || 'No expiration'}`);
      // Simulate email sending
      const emailContent = this.generateRTRNotificationEmail(candidateName, recruiterName, companyName, jobTitle, approvalUrl, expiresAt);
      this.logger.log('Email content:', emailContent);

      // In production, you would use your email service here:
      // await this.emailProvider.send({
      //   to: candidateEmail,
      //   subject: `Right to Represent Request from ${recruiterName} at ${companyName}`,
      //   html: emailContent,
      // });
    } catch (error) {
      this.logger.error('Failed to send RTR notification email:', error);
      throw new Error('Failed to send RTR notification email');
    }
  }

  sendRTRStatusUpdate(candidateEmail: string, candidateName: string, recruiterName: string, companyName: string, status: string, rtrId: string): void {
    try {
      this.logger.log(`Sending RTR status update email to: ${candidateEmail}`);
      this.logger.log(`RTR ID: ${rtrId}, Status: ${status}`);
      const emailContent = this.generateRTRStatusUpdateEmail(candidateName, recruiterName, companyName, status);
      this.logger.log('Status update email content:', emailContent);
    } catch (error) {
      this.logger.error('Failed to send RTR status update email:', error);
      throw new Error('Failed to send RTR status update email');
    }
  }

  private generateRTRNotificationEmail(
    candidateName: string,
    recruiterName: string,
    companyName: string,
    jobTitle: string,
    approvalUrl: string,
    expiresAt?: Date,
  ): string {
    const expirationText = expiresAt ? `This request expires on ${expiresAt.toLocaleDateString()}.` : '';

    return `
      <html>
        <body>
          <h2>Right to Represent Request</h2>
          <p>Dear ${candidateName},</p>
          <p>${recruiterName} from ${companyName} has requested your permission to represent you for the position: <strong>${jobTitle}</strong>.</p>
          <p>Please review and respond to this request by clicking the link below:</p>
          <p><a href="${approvalUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Request</a></p>
          <p>${expirationText}</p>
          <p>If you have any questions, please contact ${recruiterName} directly.</p>
          <p>Best regards,<br>The Right to Represent Team</p>
        </body>
      </html>
    `;
  }

  private generateRTRStatusUpdateEmail(candidateName: string, recruiterName: string, companyName: string, status: string): string {
    return `
      <html>
        <body>
          <h2>RTR Status Update</h2>
          <p>Dear ${candidateName},</p>
          <p>Your Right to Represent request from ${recruiterName} at ${companyName} has been updated to: <strong>${status}</strong>.</p>
          <p>Thank you for using our platform.</p>
          <p>Best regards,<br>The Right to Represent Team</p>
        </body>
      </html>
    `;
  }
}
