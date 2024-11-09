import '@testing-library/jest-dom';
import {vi} from "vitest";

global.fetch = vi.fn(async (input, options) => {
  const url = typeof input === 'string' && input.startsWith('/')
    ? `http://localhost${input}`
    : input;
  return await vi.importActual<typeof fetch>('node-fetch').then(actualFetch => actualFetch(url, options));
});

vi.mock('next/router', () => ({
    useRouter: () => ({
        query: {ethAddress: '0x1234'},
        push: vi.fn(),
        back: vi.fn()
    }),
}));

vi.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            findUnique: vi.fn(),
        },
    };
    return {PrismaClient: vi.fn(() => mockPrisma)};
});
