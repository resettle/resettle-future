declare module 'zeptomail' {
  // Address type for email addresses
  type Address = {
    address: string
    name?: string
  }

  // Email address wrapper
  type EmailAddress = {
    email_address: Address
  }

  // Attachment types
  type InlineAttachment = {
    content: string
    mime_type: string
    name: string
  }

  type CachedAttachment = {
    file_cache_key: string
    name: string
  }

  type Attachment = InlineAttachment | CachedAttachment

  // Inline image types
  type InlineImage = {
    mime_type: string
    content: string
    cid: string
  }

  type CachedImage = {
    file_cache_key: string
    cid: string
  }

  type Image = InlineImage | CachedImage

  // Merge info for batch emails and templates
  type MergeInfo = Record<string, string>

  // Send mail request options
  type SendMailOptions = {
    from: Address
    to: EmailAddress[]
    reply_to?: Address[]
    subject: string
    textbody?: string
    htmlbody?: string
    cc?: EmailAddress[]
    bcc?: EmailAddress[]
    track_clicks?: boolean
    track_opens?: boolean
    client_reference?: string
    mime_headers?: Record<string, string>
    attachments?: Attachment[]
    inline_images?: Image[]
  }

  // Send batch mail request options
  type SendBatchMailOptions = {
    from: Address
    to: Array<EmailAddress & { merge_info?: MergeInfo }>
    reply_to?: Address[]
    subject: string
    textbody?: string
    htmlbody?: string
    cc?: EmailAddress[]
    bcc?: EmailAddress[]
    track_clicks?: boolean
    track_opens?: boolean
    client_reference?: string
    mime_headers?: Record<string, string>
    attachments?: Attachment[]
    inline_images?: Image[]
  }

  // Send mail with template request options
  type SendMailWithTemplateOptions = {
    template_key?: string
    template_alias?: string
    from: Address
    to: EmailAddress[]
    reply_to?: Address[]
    cc?: EmailAddress[]
    bcc?: EmailAddress[]
    merge_info?: MergeInfo
    client_reference?: string
    mime_headers?: Record<string, string>
  }

  // Send batch mail with template request options
  type MailBatchWithTemplateOptions = {
    template_key?: string
    template_alias?: string
    from: Address
    to: Array<EmailAddress & { merge_info?: MergeInfo }>
    reply_to?: Address[]
    client_reference?: string
    mime_headers?: Record<string, string>
  }

  // Send mail response
  type SendMailResponse = {
    data: {
      message_id: string
      message: string
    }
  }

  // Client constructor options
  type ClientOptions = {
    url: string
    token: string
  }

  // Main SendMailClient class
  export class SendMailClient {
    constructor(options: ClientOptions)

    /**
     * Send an email using ZeptoMail
     */
    sendMail(options: SendMailOptions): Promise<SendMailResponse>

    /**
     * Send batch emails with merge info support
     */
    sendBatchMail(options: SendBatchMailOptions): Promise<SendMailResponse>

    /**
     * Send an email using a template
     */
    sendMailWithTemplate(
      options: SendMailWithTemplateOptions,
    ): Promise<SendMailResponse>

    /**
     * Send batch emails using a template
     */
    mailBatchWithTemplate(
      options: MailBatchWithTemplateOptions,
    ): Promise<SendMailResponse>
  }

  // Export types for external use
  export type {
    Address,
    Attachment,
    CachedAttachment,
    CachedImage,
    ClientOptions,
    EmailAddress,
    Image,
    InlineAttachment,
    InlineImage,
    MailBatchWithTemplateOptions,
    MergeInfo,
    SendBatchMailOptions,
    SendMailOptions,
    SendMailResponse,
    SendMailWithTemplateOptions,
  }
}
