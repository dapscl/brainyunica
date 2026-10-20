import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  fullName?: string; email?: string; company?: string; phone?: string
  monthlyRevenue?: string; clientsCount?: string; currentTools?: string
  challenges?: string; suggestedPlan?: string
}

const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? <Text style={text}><strong>{label}:</strong> {value}</Text> : null

const Email = (p: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Nuevo lead: {p.fullName ?? 'Prospecto'} – {p.company ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nuevo lead capturado</Heading>
        <Section style={box}>
          <Row label="Nombre" value={p.fullName} />
          <Row label="Email" value={p.email} />
          <Row label="Empresa" value={p.company} />
          <Row label="Teléfono" value={p.phone} />
          <Hr />
          <Row label="Facturación mensual" value={p.monthlyRevenue} />
          <Row label="Clientes activos" value={p.clientsCount} />
          <Row label="Herramientas actuales" value={p.currentTools} />
          <Row label="Desafíos" value={p.challenges} />
        </Section>
        <Text style={plan}>Plan sugerido: {p.suggestedPlan ?? '—'}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Nuevo lead: ${d.fullName ?? ''} - ${d.company ?? ''} (${d.suggestedPlan ?? ''})`,
  displayName: 'Aviso interno: nuevo lead',
  to: 'dap@unica.la',
  previewData: { fullName: 'Ana Pérez', email: 'ana@empresa.com', company: 'Empresa SA', phone: '+56 9 1234 5678', monthlyRevenue: '$50K', clientsCount: '10', suggestedPlan: 'Small Agencies' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#0a0a0a', fontSize: '22px' }
const box = { backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }
const text = { color: '#333333', fontSize: '14px', margin: '4px 0' }
const plan = { color: '#0a0a0a', fontSize: '18px', fontWeight: 'bold' as const, marginTop: '20px' }
