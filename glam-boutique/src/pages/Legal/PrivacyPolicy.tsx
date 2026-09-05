import { LegalLayout } from '@/pages/Legal/LegalLayout';
import { BRAND, CONTACT, STORE_ADDRESS } from '@/constants';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="28 de junho de 2026">
      <p>
        Esta Política de Privacidade descreve como a {BRAND.name} ("nós") coleta, usa, armazena e protege os dados
        pessoais dos visitantes e clientes da nossa loja, em conformidade com a Lei Geral de Proteção de Dados
        (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>1. Quais dados coletamos</h2>
      <p>Coletamos os seguintes tipos de dados pessoais, sempre que você interage com nossa loja:</p>
      <ul>
        <li>Dados de cadastro: nome, e-mail, telefone e senha (armazenada de forma criptografada).</li>
        <li>Dados de endereço: para cálculo de frete e entrega dos pedidos.</li>
        <li>Dados de pagamento: processados por gateways de pagamento parceiros — nunca armazenamos números completos de cartão em nossos servidores.</li>
        <li>Dados de navegação: páginas visitadas, dispositivo utilizado e origem do acesso, para entender e melhorar a experiência de compra.</li>
      </ul>

      <h2>2. Para que usamos seus dados</h2>
      <ul>
        <li>Processar e entregar seus pedidos.</li>
        <li>Enviar comunicações sobre o status da compra.</li>
        <li>Enviar newsletter e promoções, somente se você optar por recebê-las.</li>
        <li>Melhorar nosso site e prevenir fraudes.</li>
        <li>Cumprir obrigações legais e fiscais.</li>
      </ul>

      <h2>3. Com quem compartilhamos seus dados</h2>
      <p>
        Compartilhamos dados estritamente necessários com: transportadoras (para entrega), gateways de pagamento
        (para processar a transação) e autoridades públicas, quando exigido por lei. Não vendemos seus dados
        pessoais a terceiros.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Usamos cookies essenciais para o funcionamento do carrinho e da sua sessão, e cookies opcionais de
        analytics/marketing — estes últimos só são ativados após o seu consentimento, dado através do aviso de
        cookies exibido na primeira visita.
      </p>

      <h2>5. Seus direitos como titular dos dados</h2>
      <p>Conforme a LGPD, você pode solicitar a qualquer momento:</p>
      <ul>
        <li>Confirmação da existência de tratamento dos seus dados.</li>
        <li>Acesso, correção ou atualização dos seus dados.</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
        <li>Portabilidade dos dados a outro fornecedor.</li>
        <li>Revogação do consentimento e exclusão dos dados tratados com base nele.</li>
      </ul>

      <h2>6. Como exercer seus direitos</h2>
      <p>
        Entre em contato pelo e-mail <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ou compareça à nossa
        loja física em {STORE_ADDRESS.full}. Responderemos sua solicitação dentro do prazo legal.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda
        ou alteração, incluindo conexão criptografada (HTTPS) e senhas armazenadas com hash criptográfico.
      </p>

      <p className="mt-8 text-xs text-ink-400">
        Este documento é um modelo de referência e não substitui a avaliação de um(a) advogado(a) especializado(a)
        em proteção de dados antes da publicação oficial do site.
      </p>
    </LegalLayout>
  );
}
