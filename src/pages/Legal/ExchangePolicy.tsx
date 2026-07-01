import { LegalLayout } from '@/pages/Legal/LegalLayout';
import { CONTACT, STORE_ADDRESS } from '@/constants';

export default function ExchangePolicy() {
  return (
    <LegalLayout title="Política de Troca e Devolução" updatedAt="28 de junho de 2026">
      <p>
        Queremos que você se sinta segura(o) em comprar com a gente. Por isso, seguimos rigorosamente o Código de
        Defesa do Consumidor (Lei nº 8.078/1990), que garante direitos específicos para compras feitas pela internet.
      </p>

      <h2>1. Direito de arrependimento (7 dias)</h2>
      <p>
        Por se tratar de uma compra feita fora do estabelecimento físico, você tem até <strong>7 dias corridos</strong>{' '}
        após o recebimento do produto para desistir da compra, sem precisar justificar o motivo, com reembolso
        integral do valor pago (incluindo o frete).
      </p>

      <h2>2. Troca por defeito ou avaria</h2>
      <p>
        Caso o produto chegue com defeito de fabricação ou avaria de transporte, você tem até{' '}
        <strong>30 dias corridos</strong> (produtos não duráveis) para solicitar a troca ou devolução, sem custo
        adicional.
      </p>

      <h2>3. Troca por tamanho ou modelo</h2>
      <p>
        Aceitamos troca por outro tamanho, cor ou modelo em até <strong>30 dias corridos</strong> após o
        recebimento, desde que o produto esteja sem uso, com etiquetas originais e na embalagem original.
      </p>

      <h2>4. Como solicitar uma troca ou devolução</h2>
      <ul>
        <li>
          Acesse <strong>Minha conta → Meus pedidos</strong> e selecione o pedido desejado, ou entre em contato
          pelo e-mail <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </li>
        <li>Informe o motivo da troca/devolução e, se possível, fotos do produto.</li>
        <li>Nossa equipe enviará as instruções de postagem (ou agendamento de retirada).</li>
        <li>Após o recebimento e a conferência do item, processamos a troca ou o reembolso em até 10 dias úteis.</li>
      </ul>

      <h2>5. Reembolso</h2>
      <p>
        O reembolso é feito pelo mesmo método de pagamento utilizado na compra: estornos em cartão de crédito podem
        levar até 2 faturas para aparecer; via Pix, o reembolso costuma ocorrer em até 5 dias úteis.
      </p>

      <h2>6. Troca na loja física</h2>
      <p>
        Você também pode realizar a troca presencialmente em nossa loja física, em {STORE_ADDRESS.full}, levando o
        produto, a nota fiscal (ou comprovante de compra) e um documento com foto.
      </p>

      <p className="mt-8 text-xs text-ink-400">
        Este documento é um modelo de referência baseado no Código de Defesa do Consumidor e não substitui a
        avaliação de um(a) advogado(a) antes da publicação oficial do site.
      </p>
    </LegalLayout>
  );
}
