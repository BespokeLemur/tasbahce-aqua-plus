import React, { useState } from 'react';
import { ShieldAlert, MapPin, Phone, Mail, Clock, Calendar, Compass, Star, ChevronRight, Waves } from 'lucide-react';

export default function Home({ setActivePage }) {
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: 'standart',
    guests: '2'
  });
  const [successMsg, setSuccessMsg] = useState(false);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setBooking({
        name: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        roomType: 'standart',
        guests: '2'
      });
    }, 4000);
  };

  const sections = [
    {
      id: 'hotel',
      title: 'Taşbahçe Luxury Hotel',
      desc: 'Denize sıfır konumu, konforlu odaları ve benzersiz misafirperverliği ile hayalinizdeki tatili yaşayın. Her sabah dalga sesleriyle uyanın.',
      img: '/images/tasbahce_bg.png',
      badge: 'Lüks & Konfor',
      features: ['24 Saat Oda Servisi', 'Deniz Manzaralı Odalar', 'Özel Balkon & Jakuzi']
    },
    {
      id: 'aquapark',
      title: 'Taşbahçe Aqua Park',
      desc: 'Bölgenin en büyük ve en eğlenceli su parkında heyecan dolu anlar sizi bekliyor! Dev kaydıraklar, çocuk havuzları ve gün boyu süren aktiviteler.',
      img: '/images/aquapark.png',
      badge: 'Eğlence Dolu',
      features: ['Çoklu Dev Kaydıraklar', 'Güvenli Çocuk Havuzları', 'Profesyonel Cankurtaran Ekibi']
    },
    {
      id: 'cafe',
      title: 'Kafe & Restoran',
      desc: 'Şeflerimizin ellerinden çıkan yerel ve dünya lezzetlerini, muhteşem deniz manzarası eşliğinde tadın. Geniş içecek yelpazemizle serinleyin.',
      img: '/images/cafe_interior.png',
      badge: 'Gurme Lezzetler',
      features: ['Taze Deniz Mahsulleri', 'Zengin Kahvaltı Seçenekleri', 'Özel İçecekler & Kokteyller'],
      hasMenuBtn: true
    },
    {
      id: 'nargile',
      title: 'Nargile Kafe & Lounge',
      desc: 'Havuz başında, yıldızların altında en premium tütün markalarıyla hazırlanan nargile çeşitlerimizle günün yorgunluğunu atın.',
      img: '/images/shisha_lounge.png',
      badge: 'Premium Keyif',
      features: ['Dünya Markası Tütünler', 'Özel Buzlu Marpuç Sistemi', 'Loş ve Huzurlu Ortam'],
      hasMenuBtn: true
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section className="hero-bg" style={{
        backgroundImage: 'url("/images/tasbahce_bg.png")',
        backgroundColor: 'var(--primary-dark)',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div className="hero-overlay"></div>
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            padding: '8px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Waves size={16} /> Taşbahçe Aqua Plus Resort & Spa
          </div>
          <h2 className="serif-title" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            color: 'white',
            lineHeight: '1.2',
            textShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            Maviliğin ve Eğlencenin Buluştuğu Nokta
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            opacity: 0.95,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            maxWidth: '650px'
          }}>
            Otel, Aqua Park, Kafe Restoran ve Nargile Lounge konseptlerimizle size unutulmaz bir tatil deneyimi sunuyoruz.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
            <button onClick={() => setActivePage('menu')} className="btn btn-primary">
              Dijital Menüyü Aç <ChevronRight size={18} />
            </button>
            <a href="#rezervasyon" className="btn btn-secondary" style={{ color: 'var(--primary-dark)' }}>
              Hemen Rezervasyon Yap
            </a>
          </div>
        </div>
      </section>

      {/* Main Core Features Sections */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Neler Sunuyoruz?
          </span>
          <h3 className="serif-title" style={{ fontSize: '2rem', marginTop: '8px', color: 'var(--primary-dark)' }}>
            Tüm İhtiyaçlarınız İçin Tek Bir Tesis
          </h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>
            Taşbahçe bünyesinde yer alan seçkin bölümlerimizle hem eğlenebilir, hem dinlenebilir, hem de eşsiz lezzetlerimizin tadını çıkarabilirsiniz.
          </p>
        </div>

        {sections.map((sec, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={sec.id} style={{
              display: 'flex',
              flexDirection: isEven ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }} className="section-row">
              {/* Image */}
              <div style={{ flex: '1 1 450px', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', minHeight: '350px' }}>
                <img src={sec.img} alt={sec.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>
                  <span className="badge badge-primary" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-sm)' }}>
                    {sec.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{sec.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>{sec.desc}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '8px 0' }}>
                  {sec.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', padding: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--primary)' }}>
                        <Star size={12} fill="var(--primary)" />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '10px' }}>
                  {sec.hasMenuBtn ? (
                    <button onClick={() => setActivePage('menu')} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                      Menüyü Görüntüle
                    </button>
                  ) : sec.id === 'hotel' ? (
                    <a href="#rezervasyon" className="btn btn-secondary" style={{ padding: '10px 24px' }}>
                      Odaları Keşfet
                    </a>
                  ) : (
                    <a href="#bilgi" className="btn btn-secondary" style={{ padding: '10px 24px' }}>
                      Detaylı Bilgi
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Reservation Form Section */}
      <section id="rezervasyon" style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: 'white',
        padding: '80px 24px',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '1200px',
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(79,195,247,0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', lg: 'row', gap: '40px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }} className="reservation-container">
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>REZERVE EDİN</span>
            <h3 className="serif-title" style={{ fontSize: '2.25rem', color: 'white' }}>Yerinizi Şimdiden Ayırtın</h3>
            <p style={{ opacity: 0.85, fontSize: '1.05rem', lineHeight: '1.6' }}>
              En konforlu odalarımızda deniz manzarası eşliğinde harika bir konaklama için formu doldurun. Satış temsilcimiz en kısa sürede sizi arayacaktır.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ color: 'var(--accent)' }} /> <span>+90 (224) 555 44 33</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} style={{ color: 'var(--accent)' }} /> <span>rezervasyon@tasbahceaquaplus.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> <span>Kumla Sahili Cad. No:12, Gemlik / Bursa</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ flex: '1 1 400px', padding: '30px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
            {successMsg ? (
              <div className="animate-scale-in" style={{
                textAlign: 'center',
                padding: '40px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(79, 195, 247, 0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContents: 'center', justifyContent: 'center' }}>
                  <Calendar size={32} />
                </div>
                <h4 style={{ color: 'white', fontSize: '1.4rem' }}>Talep Alındı!</h4>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                  Rezervasyon talebiniz başarıyla iletilmiştir. Ekibimiz en kısa sürede telefon numaranızdan sizinle iletişime geçecektir. Teşekkür ederiz!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={booking.name}
                    onChange={(e) => setBooking({...booking, name: e.target.value})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                    placeholder="Adınız ve Soyadınız"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Telefon Numarası</label>
                  <input
                    type="tel"
                    required
                    value={booking.phone}
                    onChange={(e) => setBooking({...booking, phone: e.target.value})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                    placeholder="0 (555) 555 55 55"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Giriş Tarihi</label>
                    <input
                      type="date"
                      required
                      value={booking.checkIn}
                      onChange={(e) => setBooking({...booking, checkIn: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Çıkış Tarihi</label>
                    <input
                      type="date"
                      required
                      value={booking.checkOut}
                      onChange={(e) => setBooking({...booking, checkOut: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Oda Tipi</label>
                    <select
                      value={booking.roomType}
                      onChange={(e) => setBooking({...booking, roomType: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15, 76, 129, 0.9)', color: 'white', outline: 'none', height: '45px' }}
                    >
                      <option value="standart">Standart Oda (Deniz Manzaralı)</option>
                      <option value="aile">Aile Odası (2+2)</option>
                      <option value="suit">Taşbahçe Luxury Suit</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Kişi Sayısı</label>
                    <select
                      value={booking.guests}
                      onChange={(e) => setBooking({...booking, guests: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15, 76, 129, 0.9)', color: 'white', outline: 'none', height: '45px' }}
                    >
                      <option value="1">1 Kişi</option>
                      <option value="2">2 Kişi</option>
                      <option value="3">3 Kişi</option>
                      <option value="4">4+ Kişi</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '8px' }}>
                  Rezervasyon Talebi Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--primary-dark)',
        color: 'rgba(255,255,255,0.8)',
        padding: '60px 24px 20px',
        marginTop: '40px',
        borderTop: '5px solid var(--accent)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }} className="footer-cols">
          
          {/* Col 1: About */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h5 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>TAŞBAHÇE AQUA PLUS</h5>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Bursa Gemlik\'te denizin, eğlencenin ve lezzetin tek adresi. Konforlu otelimiz, dev kaydıraklı aqua parkımız, şık restoranımız ve havuz başı nargile keyfimizle hizmetinizdeyiz.
            </p>
          </div>

          {/* Col 2: Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h5 style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>ÇALIŞMA SAATLERİ</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} /> <span>Otel: 7/24 Açık</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} /> <span>Aqua Park: 10:00 - 18:30</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} /> <span>Kafe & Mutfak: 08:30 - 00:00</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} /> <span>Nargile Cafe: 12:00 - 02:00</span>
              </div>
            </div>
          </div>

          {/* Col 3: Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h5 style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>HIZLI ERİŞİM</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <span onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{ cursor: 'pointer' }}>Geri Dön</span>
              <span onClick={() => setActivePage('menu')} style={{ cursor: 'pointer' }}>Dijital QR Menü</span>
              <span onClick={() => setActivePage('admin')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                Personel Giriş Paneli (Gizli)
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem'
        }}>
          <span>© 2026 Taşbahçe Aqua Plus. Tüm Hakları Saklıdır.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }}>Gizlilik Politikası</span>
            <span style={{ cursor: 'pointer' }}>Kullanım Koşulları</span>
          </div>
        </div>
      </footer>

      {/* Responsive adjustments styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .section-row { flex-direction: column !important; }
          .reservation-container { flex-direction: column !important; }
        }
      `}} />
    </div>
  );
}
