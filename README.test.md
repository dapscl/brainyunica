# Testing Guide

## Overview

Este proyecto utiliza Vitest como framework de testing con React Testing Library para tests de componentes.

## Ejecutar Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Estructura de Tests

```
src/test/
├── setup.ts                    # Configuración global de tests
├── components/                 # Tests de componentes UI
│   └── Button.test.tsx
├── utils/                      # Tests de utilidades
│   └── auth.test.ts
└── integration/                # Tests de integración
    └── organization-flow.test.tsx
```

## Escribir Tests

### Test de Componente

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Test de Hook

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

it('fetches data correctly', async () => {
  const { result } = renderHook(() => useQuery(...));
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

## Mocks

Los mocks globales están configurados en `src/test/setup.ts`:
- Supabase client
- React Router
- React Query

## Coverage

El coverage está configurado para excluir:
- node_modules
- archivos de configuración
- archivos .d.ts
- carpeta dist

Objetivo: >80% coverage en componentes críticos.

## Best Practices

1. **Nombres descriptivos**: Usa nombres claros que describan qué testea
2. **Arrange-Act-Assert**: Organiza tests en estas 3 fases
3. **Mock lo necesario**: Solo mockea dependencias externas
4. **Tests aislados**: Cada test debe ser independiente
5. **Cleanup**: Usa afterEach para limpiar entre tests
