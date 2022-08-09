import {
    isValidCEP,
    formatCEP as formatCepBu,
    isValidCNPJ,
    formatCNPJ as formatCnpjBU,
    isValidCPF,
    formatCPF as formatCpfBU,
    isValidBoleto,
    formatBoleto as formatBoletoBU
} from '@brazilian-utils/brazilian-utils'

class Brazilian {
    isCep(cep: string): boolean {
        return isValidCEP(cep)
    }

    formatCep(cnpj: string): string {
        return formatCepBu(cnpj)
    }

    isCnpj(cnpj: string): boolean {
        return isValidCNPJ(cnpj)
    }

    formatCNPJ(cnpj: string): string {
        return formatCnpjBU(cnpj)
    }

    isCPF(cpf: string): boolean {
        return isValidCPF(cpf)
    }

    formatCPF(cpf: string): string {
        return formatCpfBU(cpf)
    }

    isBoleto(Boleto: string): boolean {
        return isValidBoleto(Boleto)
    }

    formatBoleto(Boleto: string): string {
        return formatBoletoBU(Boleto)
    }
}

export default Brazilian
