import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  email?: string; brandHandle?: string; brandType?: string; brandName?: string
  detectedTone?: string; detectedStyle?: string
}

const Email = (p: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Nueva prueba gratis: {p.brandName ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nueva prueba gratis iniciada</Heading>
        <Section style={box}>
          <Text style={text}><strong>Email:</strong> {p.email ?? '—'}</Text>
          <Text style={text}><strong>Handle/URL:</strong> {p.brandHandle ?? '—'}</Text>
          <Text style={text}><strong>Tipo:</strong> {p.brandType === 'instagram' ? 'Instagram' : 'Sitio web'}</Text>
          <Text style={text}><strong>Marca:</strong> {p.brandName ?? '—'}</Text>
          <Text style={text}><strong>Tono:</strong> {p.detectedTone ?? '—'}</Text>
          <Text style={text}><strong>Estilo:</strong> {p.detectedStyle ?? '—'}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Nueva prueba: ${d.email ?? ''} - ${d.brandName ?? ''}`,
  displayName: 'Aviso interno: nueva prueba gratis',
  to: 'dap@unica.la',
  previewData: { email: 'ana@empresa.com', brandHandle: '@empresa', brandType: 'instagram', brandName: 'Empresa', detectedTone: 'Cercano', detectedStyle: 'Minimalista' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#0a0a0a', fontSize: '22px' }
const box = { backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }
const text = { color: '#333333', fontSize: '14px', margin: '4px 0' }
