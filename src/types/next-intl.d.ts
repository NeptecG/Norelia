// Provides full TypeScript autocomplete for useTranslations() calls.
// next-intl reads this type to validate key names at compile time.
type Messages = typeof import('../../messages/en.json')

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare interface IntlMessages extends Messages {}
