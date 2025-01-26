import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import BlogPostForm from '../components/BlogPostForm';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
}

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const createWelcomePost = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: "🌍🌱 Bem-vindo ao GlobalForests: Plantando o Futuro Juntos!",
            content: `Introdução\n\nEstamos entusiasmados em dar as boas-vindas a todos ao nosso blog! O projeto GlobalForests tem como missão bitar um mundo sustentável por meio do reflorestamento, da promoção da biodiversidade e do apoio às comunidades locais. Neste primeiro post, apresentaremos uma visão completa de nosso projeto, objetivos, estratégias e como você pode ajudar.\n\nO que é o GlobalForests?\n\nO GlobalForests é um projeto internacional dedicado ao reflorestamento de áreas degradadas ao redor do mundo. Nossa visão é criar um futuro onde a natureza e as comunidades prosperam juntas, revertendo os impactos do desmatamento e das mudanças climáticas.\n\nNossos Objetivos\n\n1. Reflorestar áreas degradadas: Plantar milhões de árvores anualmente em regiões prioritárias, recuperando ecossistemas essenciais.\n\n2. Promover a biodiversidade: Recuperar habitats para espécies ameaçadas e fortalecer a saúde dos ecossistemas.\n\n3. Mitigar as mudanças climáticas: Aumentar o sequestro de carbono atmosférico e reduzir o impacto do aquecimento global.\n\n4. Educar e engajar: Conscientizar a população global sobre a importância do reflorestamento e da preservação ambiental.\n\nComo Funciona\n\nO projeto é estruturado em diversas etapas:\n\n- Identificação de Áreas Prioritárias: Mapeamos regiões degradadas em colaboração com especialistas ambientais e comunidades locais, priorizando áreas críticas.\n\n- Parcerias Locais e Globais: Estabelecemos parcerias com ONGs, governos e empresas especializadas para garantir um impacto sustentável.\n\n- Execução do Plantio: Utilizamos técnicas como o plantio manual e drones, garantindo eficiência nas áreas de difícil acesso.\n\n- Monitoramento e Manutenção: Realizamos acompanhamento constante por meio de tecnologias avançadas, incluindo imagens de satélite e drones.\n\nImpacto Esperado\n\nNosso projeto está estruturado para ter um impacto ambiental e social significativo. As iniciativas incluem:\n\n- Redução das emissões de carbono.\n\n- Recuperação de ecossistemas e aumento da biodiversidade.\n\n- Geração de empregos locais e promoção da educação ambiental.\n\nSustentabilidade Financeira\n\nPara garantir a continuidade do nosso trabalho, utilizamos diversas fontes de financiamento, incluindo doações diretas, crowdfunding e parcerias corporativas. A transparência é essencial; portanto, manteremos um painel atualizado em nosso site, mostrando o uso dos recursos e o impacto gerado.\n\nComo Você Pode Ajudar\n\nParticipe do GlobalForests de várias maneiras:\n\n- Doações: Contribua financeiramente para o reflorestamento.\n\n- Voluntariado: Inscreva-se para ajudar nas campanhas de plantio e eventos locais.\n\n- Educação e Conscientização: Compartilhe informações sobre nosso projeto em suas redes sociais.\n\nFique Conectado\n\nEstamos animados com o que está por vir e queremos que você esteja conosco nesta jornada. Siga-nos nas nossas redes sociais e fique atento para mais atualizações, histórias inspiradoras e oportunidades de engajamento.\n\nJuntos, podemos plantar um futuro mais verde e sustentável!\n\n🌳 GlobalForests: Together, We Grow the Future.`,
            author_id: user.id
          }
        ]);

      if (error) throw error;
      await loadBlogPosts();
    } catch (error) {
      console.error('Error creating welcome post:', error);
    }
  };

  useEffect(() => {
    if (user && posts.length === 0 && !loading) {
      createWelcomePost();
    }
  }, [user, posts, loading]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GlobalForests Blog</h1>
        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            <PenSquare className="h-5 w-5" />
            <span>New Post</span>
          </button>
        )}
      </div>

      {showForm && (
        <BlogPostForm
          onClose={() => setShowForm(false)}
          onSuccess={loadBlogPosts}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="prose max-w-none text-gray-600">
                  {formatContent(post.content)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}