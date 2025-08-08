import HeroSection from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/guest/main-layout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Brain, CheckCircle, Droplets, Leaf, Target, Users, Zap } from 'lucide-react';
export default function LandingPage() {
    const features = [
        {
            icon: <Brain className="h-8 w-8 text-green-600" />,
            title: 'AI-Powered Rekomendasi',
            description: 'Algoritma Decision Tree yang canggih menganalisis data nutrisi untuk memberikan rekomendasi yang akurat dan optimal.',
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
            title: 'Real-time Monitoring',
            description: 'Pantau kondisi nutrisi tanaman secara real-time dengan dashboard yang intuitif dan mudah dipahami.',
        },
        {
            icon: <Target className="h-8 w-8 text-purple-600" />,
            title: 'Precision Agriculture',
            description: 'Tingkatkan hasil panen dengan rekomendasi nutrisi yang tepat sasaran berdasarkan data ilmiah.',
        },
        {
            icon: <Zap className="h-8 w-8 text-yellow-600" />,
            title: 'Automated Decisions',
            description: 'Sistem otomatis yang membantu mengambil keputusan nutrisi tanpa perlu keahlian mendalam.',
        },
    ];

    return (
        <MainLayout>
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="py-12 px-4">
               <HeroSection />
            </section>

             {/* Benefits Section */}
      <section className="py-16 bg-muted/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Manfaat Sistem Rekomendasi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan berbagai manfaat dari sistem klasifikasi nutrisi sayuran
              untuk membantu anak-anak mendapatkan gizi yang tepat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Siap untuk Mengklasifikasikan Sayuran?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Mulai gunakan sistem klasifikasi kami untuk membantu anak-anak
              mendapatkan nutrisi yang tepat dari sayuran.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">
                Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
        </MainLayout>
    );
}
// Benefits data
const benefits = [
  {
    title: "Rekomendasi Akurat",
    description:
      "Menggunakan algoritma Decision Tree untuk mengklasifikasikan sayuran berdasarkan nilai nutrisi dengan akurasi tinggi.",
    icon: <Leaf className="h-6 w-6 text-primary" />,
  },
  {
    title: "Visualisasi Data",
    description:
      "Melihat data nutrisi sayuran dalam bentuk grafik dan diagram yang mudah dipahami.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Edukasi Nutrisi",
    description:
      "Membantu orang tua dan guru memahami nilai nutrisi sayuran untuk pendidikan gizi anak-anak.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
];
