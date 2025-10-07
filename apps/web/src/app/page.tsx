import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  Mail, 
  Smartphone,
  CheckCircle,
  Star,
  MapPin,
  Phone
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
              🚀 Plataforma SaaS Multi-tenant
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AgendaCortes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed">
              A plataforma completa de agendamento para barbearias e salões de beleza. 
              Gerencie horários, profissionais e pagamentos em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Começar Gratuitamente
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-slate-400 text-slate-300 hover:bg-slate-800">
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Tudo que você precisa para gerenciar sua barbearia
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Uma solução completa que simplifica o agendamento e aumenta a eficiência do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Agendamento Online</CardTitle>
                <CardDescription>
                  Sistema intuitivo para clientes agendarem serviços com seus profissionais favoritos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Gestão de Horários</CardTitle>
                <CardDescription>
                  Configure horários de trabalho, pausas e exceções para cada profissional.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Multi-profissionais</CardTitle>
                <CardDescription>
                  Gerencie múltiplos profissionais, seus serviços e disponibilidades.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Pagamentos Online</CardTitle>
                <CardDescription>
                  Integração com Stripe para pagamentos seguros via cartão e PIX.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Lembretes Automáticos</CardTitle>
                <CardDescription>
                  Envio automático de lembretes por email 24h e 2h antes do agendamento.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Responsivo</CardTitle>
                <CardDescription>
                  Interface otimizada para desktop, tablet e smartphone.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Como Funciona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Em poucos passos, sua barbearia estará online e recebendo agendamentos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Cadastre sua Barbearia</h3>
              <p className="text-slate-600">
                Crie sua conta, adicione informações da barbearia, serviços e profissionais.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Configure Horários</h3>
              <p className="text-slate-600">
                Defina os horários de funcionamento e disponibilidade de cada profissional.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Receba Agendamentos</h3>
              <p className="text-slate-600">
                Compartilhe o link da sua página e comece a receber agendamentos online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Por que escolher o AgendaCortes?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Redução de No-shows</h4>
                    <p className="text-slate-600">Lembretes automáticos reduzem faltas em até 70%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Aumento da Receita</h4>
                    <p className="text-slate-600">Pagamentos online e melhor gestão de horários</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Experiência do Cliente</h4>
                    <p className="text-slate-600">Interface moderna e processo de agendamento simples</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Gestão Centralizada</h4>
                    <p className="text-slate-600">Todos os agendamentos e informações em um só lugar</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">Avaliação dos Clientes</h3>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-4">4.9/5 estrelas</p>
                <p className="text-blue-100">
                  "O AgendaCortes transformou a gestão da nossa barbearia. 
                  Agora temos controle total dos agendamentos e nossos clientes adoram a praticidade."
                </p>
                <p className="text-sm mt-4 text-blue-200">- João Silva, Barbearia Central</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para modernizar sua barbearia?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Junte-se a centenas de barbearias que já usam o AgendaCortes para gerenciar seus agendamentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Começar Agora - Grátis
              </Button>
            </Link>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                Falar com Vendas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AgendaCortes</h3>
              <p className="text-slate-400 mb-4">
                A plataforma completa para gestão de agendamentos em barbearias e salões.
              </p>
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="text-slate-400">São Paulo, Brasil</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/recursos" className="hover:text-white">Recursos</Link></li>
                <li><Link href="/precos" className="hover:text-white">Preços</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demonstração</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/ajuda" className="hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentação</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/carreiras" className="hover:text-white">Carreiras</Link></li>
                <li><Link href="/privacidade" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-slate-700" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              © 2024 AgendaCortes. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/termos" className="text-slate-400 hover:text-white">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-slate-400 hover:text-white">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
