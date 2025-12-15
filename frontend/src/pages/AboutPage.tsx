import React from 'react';
import { ChefHat, Heart, Award, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-500 to-accent text-white section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-1 text-white mb-6">About HEDDIEKITCHEN</h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Bringing authentic African cuisine to your doorstep with love, care, and premium ingredients.
          </p>
        </div>
      </section>

      {/* Chef's Profile */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <ChefHat className="text-primary" size={28} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary font-semibold">Chef's Profile</p>
                  <h2 className="heading-2 mb-0">Heddad Uduapi Onoshoagbe</h2>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-800 space-y-4">
                <p>
                  Heddad Uduapi Onoshoagbe is the creative force behind Heddiekitchen, a proudly African culinary brand
                  known for its rich flavors, authenticity, and exceptional service. A trained statistician turned
                  professional chef, Heddad combines precision, creativity, and deep cultural passion in every dish she
                  crafts.
                </p>
                <p>
                  Her culinary journey was formally shaped at MariaMartha Catering School, Catholic Diocese of Auchi,
                  where she completed an intensive six-month catering program and graduated with Merit. This training
                  refined her skills in food preparation, menu development, event catering, and modern presentation.
                </p>
                <p>
                  Since the birth of Heddiekitchen in 2018/2019, Heddad has consistently elevated her craft through
                  advanced learning, hands-on experience, and a commitment to excellence. She has successfully
                  championed numerous events; ranging from intimate gatherings to full-service corporate and cultural
                  occasions, earning a reputation for reliability, elegance, and unforgettable flavors.
                </p>
                <p>
                  Chef Heddad specializes in authentic African delicacies, blending traditional techniques with
                  contemporary flair to create meals that are both nostalgic and refined. Her passion is rooted in
                  preserving the richness of African cuisine while presenting it with a modern, premium touch.
                </p>
                <p>
                  Today, Heddad continues to grow Heddiekitchen into a versatile food brand known for quality,
                  innovation, and heart-centered service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="heading-2 mb-6">Our Story</h2>
              <p className="text-body text-lg mb-6">
                HEDDIEKITCHEN is a family-run food service dedicated to providing delicious, home-style meals for busy people. 
                We offer daily menus, weekly meal plans, catering for events, and nationwide shipping for select items.
              </p>
              <p className="text-body text-lg mb-6">
                Our mission is to make wholesome, tasty food accessible and convenient. We source fresh ingredients locally 
                and prepare meals with care, ensuring every dish reflects the authentic flavors of African cuisine.
              </p>
              <p className="text-body text-lg">
                From our kitchen to your table, we're committed to delivering quality, freshness, and exceptional service 
                that makes every meal a memorable experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-2 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Authenticity</h3>
              <p className="text-body text-sm">Traditional recipes passed down through generations</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality</h3>
              <p className="text-body text-sm">Premium ingredients and careful preparation</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-body text-sm">Consistent quality in every meal we serve</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-body text-sm">Building connections through food</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary via-primary-500 to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 text-white mb-4">Ready to Experience Our Food?</h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Browse our menu, explore meal plans, or contact us for catering services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              View Menu
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all"
            >
              Contact Us
            </a>
        </div>
      </div>
      </section>
    </div>
  );
};

export default AboutPage;
