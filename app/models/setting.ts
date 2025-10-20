import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type ContactInfo = {
  email?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
}

function toJsonString(value: unknown, fallback: any) {
  if (value === null || value === undefined) return JSON.stringify(fallback)
  try {
    return JSON.stringify(value)
  } catch {
    return JSON.stringify(fallback)
  }
}

function fromJsonString<T = any>(value: any, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  // Already parsed (for drivers that return objects)
  return (value as T) ?? fallback
}

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    columnName: 'socials',
    serialize: (value) => value ?? [],
    prepare: (value: any) => toJsonString(value, []),
    consume: (value: any) => fromJsonString(value, []),
  })
  declare socials: { title: string; url: string }[]

  @column({
    columnName: 'home_links',
    serialize: (value) => value ?? [],
    prepare: (value: any) => toJsonString(value, []),
    consume: (value: any) => fromJsonString(value, []),
  })
  declare homeLinks: { title: string; url: string }[]

  @column({
    columnName: 'contact',
    serialize: (value) => value ?? {},
    prepare: (value: any) => (value === null ? null : toJsonString(value, {})),
    consume: (value: any) => fromJsonString(value, {} as ContactInfo),
  })
  declare contact: ContactInfo | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
