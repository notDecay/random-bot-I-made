export const logging = {
  webhook: {
    id: process.env['LOGGING_WEBHOOK_ID']!,
    token: process.env['LOGGING_WEBHOOK_TOKEN']!,
  }
} as const