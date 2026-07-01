import { LegalLayout } from '@/pages/Legal/LegalLayout';
import { BRAND, CONTACT, STORE_ADDRESS } from '@/constants';

export default function TermsOfUse() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="28 de junho de 2026">
      <p>
        Ao acessar e utilizar o site da {BRAND.name}, você concorda com os termos e condições descritos a seguir.
        Caso não concorde, recomendamos que não utilize nossos serviços.
      </p>

      <h2>1. Sobre a loja</h2>
      <p>
        A {BRAND.name} é uma loja de moda com sede física em {STORE_ADDRESS.full}, que também opera por meio deste
        site de comércio eletrônico.
      </p>

      <h2>2. Cadastro e conta</h2>
      <p>
        Para realizar compras, pode ser necessário criar uma conta com informações verdadeiras, completas e
        atualizadas. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades
        realizadas em sua conta.
      </p>

      <h2>3. Preços e disponibilidade</h2>
      <p>
        Os preços exibidos podem ser alterados sem aviso prévio. A disponibilidade de estoque é informada no
        momento da compra; em caso de indisponibilidade após a confirmação do pedido, você será notificado e
        reembolsado integralmente.
      </p>

      <h2>4. Pagamento</h2>
      <p>
        Aceitamos os métodos de pagamento exibidos na etapa de checkout (Pix, cartão de crédito, boleto bancário e
        carteiras digitais, conforme disponibilidade). O processamento é feito por gateways de pagamento parceiros,
        sujeitos aos próprios termos de uso.
      </p>

      <h2>5. Entrega</h2>
      <p>
        Os prazos de entrega informados no checkout são estimativas e podem variar de acordo com a transportadora e
        a região de destino. Em caso de atraso significativo, entre em contato com nosso atendimento.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo deste site — textos, imagens, logotipo e identidade visual — pertence à {BRAND.name} ou aos
        seus licenciadores, sendo proibida a reprodução sem autorização prévia.
      </p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>
        Fazemos o possível para manter as informações do site precisas e atualizadas, mas não garantimos a
        ausência total de erros. Não nos responsabilizamos por danos indiretos decorrentes do uso do site.
      </p>

      <h2>8. Alterações destes termos</h2>
      <p>
        Podemos atualizar estes Termos de Uso periodicamente. A versão vigente estará sempre publicada nesta
        página, com a data da última atualização indicada no topo.
      </p>

      <h2>9. Contato</h2>
      <p>
        Dúvidas sobre estes termos podem ser enviadas para{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>

      <p className="mt-8 text-xs text-ink-400">
        Este documento é um modelo de referência e não substitui a avaliação de um(a) advogado(a) antes da
        publicação oficial do site.
      </p>
    </LegalLayout>
  );
}
