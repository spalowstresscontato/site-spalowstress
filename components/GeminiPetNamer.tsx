import React, { useState } from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

const GeminiPetNamer: React.FC = () => {
  const [petType, setPetType] = useState('Cachorro');
  const [personality, setPersonality] = useState('Brincalhão');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Banco de dados local de nomes de pets
  const petNames = {
    'Cachorro': {
      'Brincalhão': [
        '1. Turbo - Energia infinita',
        '2. Bolinha - Sempre pulando',
        '3. Foguete - Velocidade máxima',
        '4. Pipoca - Salta alto',
        '5. Zumbi - Energia noturna',
        '6. Max - Amigo brincalhão',
        '7. Luna - Energia lunar',
        '8. Rex - Rei da diversão',
        '9. Thor - Deus da força',
        '10. Bella - Linda e ativa',
        '11. Spike - Espinhoso divertido',
        '12. Toby - Companheiro fiel',
        '13. Zoe - Energia pura',
        '14. Buddy - Melhor amigo',
        '15. Nina - Doce aventureira',
        '16. Chocolate - Doce e ativo',
        '17. Caramelo - Doce brincalhão',
        '18. Pretinho - Preto e veloz',
        '19. Branco - Branco e saltitante',
        '20. Amarelinho - Amarelo e alegre'
      ],
      'Preguiçoso': [
        '1. Soneca - Rei do descanso',
        '2. Pregui - Mestre da preguiça',
        '3. Almofada - Vive deitado',
        '4. Cochilo - Sempre dormindo',
        '5. Puff - Fofo e mole',
        '6. Mingau - Mole e quentinho',
        '7. Bolor - Rei da preguiça',
        '8. Sonequinha - Rainha do sono',
        '9. Preguicinha - Arte da preguiça',
        '10. Almofadinha - Vive no sofá',
        '11. Cochilinho - Sempre descansando',
        '12. Moleque - Fofo e preguiçoso',
        '13. Puffinho - Muito mole',
        '14. Soneca - Mestre do descanso',
        '15. Preguiça - Rainha preguiçosa',
        '16. Chocolate - Doce dorminhoco',
        '17. Caramelo - Doce preguiçoso',
        '18. Pretinho - Preto e mole',
        '19. Branco - Branco e preguiçoso',
        '20. Amarelinho - Amarelo dorminhoco'
      ],
      'Real': [
        '1. Rex - Rei dos cães',
        '2. Lord - Nobre e elegante',
        '3. Duque - Classe superior',
        '4. Baron - Sofisticado',
        '5. Conde - Distinto',
        '6. Princesa - Nobre canina',
        '7. Lady - Elegante',
        '8. Duque - Classe pura',
        '9. Marquesa - Sofisticada',
        '10. Condessa - Distinta',
        '11. Faraó - Rei antigo',
        '12. Imperador - Soberano',
        '13. Rainha - Majestosa',
        '14. Príncipe - Herdeiro real',
        '15. Baronesa - Nobre senhora',
        '16. Chocolate - Doce nobre',
        '17. Caramelo - Doce sofisticado',
        '18. Pretinho - Preto elegante',
        '19. Branco - Branco real',
        '20. Amarelinho - Amarelo distinto'
      ],
      'Bobo': [
        '1. Bobo - Sempre rindo',
        '2. Trapalhão - Desajeitado fofo',
        '3. Maluco - Ideias loucas',
        '4. Doidão - Alegria pura',
        '5. Bagunceiro - Caos controlado',
        '6. Bobinho - Risadas caninas',
        '7. Trapalha - Desajeitado fofo',
        '8. Maluquinho - Ideias malucas',
        '9. Doidinho - Alegria pura',
        '10. Bagunceira - Caos fofo',
        '11. Pateta - Engraçado',
        '12. Goofy - Bobo clássico',
        '13. Bobão - Muito bobo',
        '14. Trapaceiro - Sempre aprontando',
        '15. Malandrinho - Esperto bobo',
        '16. Chocolate - Doce bobo',
        '17. Caramelo - Doce maluco',
        '18. Pretinho - Preto engraçado',
        '19. Branco - Branco pateta',
        '20. Amarelinho - Amarelo bobo'
      ],
      'Valente': [
        '1. Thor - Deus da força',
        '2. Hulk - Poderoso',
        '3. León - Rei da selva',
        '4. Guerreiro - Corajoso',
        '5. Bravo - Valente',
        '6. Zeus - Rei dos deuses',
        '7. Apollo - Deus grego',
        '8. Spartacus - Guerreiro',
        '9. Conan - Bárbaro',
        '10. Achilles - Herói grego',
        '11. Leónidas - Rei espartano',
        '12. Maximus - Gladiador',
        '13. Brutus - Forte romano',
        '14. César - Imperador',
        '15. Odin - Deus nórdico',
        '16. Chocolate - Doce valente',
        '17. Caramelo - Doce guerreiro',
        '18. Pretinho - Preto corajoso',
        '19. Branco - Branco bravo',
        '20. Amarelinho - Amarelo herói'
      ]
    },
    'Gato': {
      'Brincalhão': [
        '1. Teco - Energia felina',
        '2. Pula-Pula - Salta tudo',
        '3. Brincalhão - Festa constante',
        '4. Dançarino - Ritmo próprio',
        '5. Foguinho - Fogo amigo',
        '6. Garfield - Gato preguiçoso',
        '7. Tom - Caçador incansável',
        '8. Frajola - Gato malhado',
        '9. Mingau - Fofo brincalhão',
        '10. Whiskas - Bigodes compridos',
        '11. Bolinha - Sempre rolando',
        '12. Pipoca - Salta alto',
        '13. Foguete - Velocidade felina',
        '14. Dançarina - Ritmo próprio',
        '15. Alegria - Felicidade pura',
        '16. Chocolate - Doce ativo',
        '17. Caramelo - Doce saltitante',
        '18. Pretinho - Preto veloz',
        '19. Branco - Branco brincalhão',
        '20. Amarelinho - Amarelo energético'
      ],
      'Preguiçoso': [
        '1. Sonequinha - Rainha do sono',
        '2. Almofadinha - Vive no sofá',
        '3. Preguicinha - Arte da preguiça',
        '4. Cochilinho - Sempre descansando',
        '5. Molezinha - Fofo e preguiçoso',
        '6. Garfield - Mestre da preguiça',
        '7. Soneca - Rainha do descanso',
        '8. Almofada - Vive deitada',
        '9. Cochilo - Sempre dormindo',
        '10. Puff - Fofo e mole',
        '11. Mingau - Mole e quentinho',
        '12. Bolor - Rei da preguiça',
        '13. Sonequinha - Rainha do sono',
        '14. Preguicinha - Arte da preguiça',
        '15. Almofadinha - Vive no sofá',
        '16. Chocolate - Doce preguiçoso',
        '17. Caramelo - Doce mole',
        '18. Pretinho - Preto dorminhoco',
        '19. Branco - Branco preguiçoso',
        '20. Amarelinho - Amarelo dorminhoco'
      ],
      'Real': [
        '1. Princesa - Nobre felina',
        '2. Lady - Elegante',
        '3. Duquesa - Classe pura',
        '4. Marquesa - Sofisticada',
        '5. Condessa - Distinta',
        '6. Cleópatra - Rainha egípcia',
        '7. Bastet - Deusa felina',
        '8. Faraó - Rei antigo',
        '9. Imperatriz - Soberana',
        '10. Rainha - Majestosa',
        '11. Princesa - Herdeira real',
        '12. Lady - Nobre senhora',
        '13. Duquesa - Classe superior',
        '14. Marquesa - Sofisticada',
        '15. Condessa - Distinta',
        '16. Chocolate - Doce nobre',
        '17. Caramelo - Doce elegante',
        '18. Pretinho - Preto sofisticado',
        '19. Branco - Branco real',
        '20. Amarelinho - Amarelo distinto'
      ],
      'Bobo': [
        '1. Bobinho - Risadas felinas',
        '2. Trapalha - Desajeitado fofo',
        '3. Maluquinha - Ideias malucas',
        '4. Doidinha - Alegria pura',
        '5. Bagunceira - Caos fofo',
        '6. Pateta - Engraçada',
        '7. Goofy - Boba clássica',
        '8. Bobona - Muito boba',
        '9. Trapaceira - Sempre aprontando',
        '10. Malandrinho - Esperto bobo',
        '11. Bobinho - Risadas felinas',
        '12. Trapalha - Desajeitado fofo',
        '13. Maluquinha - Ideias malucas',
        '14. Doidinha - Alegria pura',
        '15. Bagunceira - Caos fofo',
        '16. Chocolate - Doce boba',
        '17. Caramelo - Doce maluca',
        '18. Pretinho - Preto engraçado',
        '19. Branco - Branco pateta',
        '20. Amarelinho - Amarelo bobo'
      ],
      'Valente': [
        '1. Tigresa - Rainha da selva',
        '2. Leoa - Poderosa',
        '3. Guerreirinha - Corajosa',
        '4. Brava - Valente',
        '5. Amazona - Guerreira',
        '6. Artemis - Deusa caçadora',
        '7. Athena - Deusa da guerra',
        '8. Freya - Deusa nórdica',
        '9. Valkyrie - Guerreira',
        '10. Xena - Princesa guerreira',
        '11. Tigresa - Rainha da selva',
        '12. Leoa - Poderosa',
        '13. Guerreirinha - Corajosa',
        '14. Brava - Valente',
        '15. Amazona - Guerreira',
        '16. Chocolate - Doce valente',
        '17. Caramelo - Doce guerreira',
        '18. Pretinho - Preto corajoso',
        '19. Branco - Branco bravo',
        '20. Amarelinho - Amarelo herói'
      ]
    },
    'Pássaro': {
      'Brincalhão': [
        '1. Voador - Mestre do ar',
        '2. Dançarino - Ritmo alado',
        '3. Saltitante - Energia voadora',
        '4. Alegria - Canto feliz',
        '5. Foguete - Velocidade aérea',
        '6. Tweety - Pássaro amarelo',
        '7. Woodstock - Pássaro amigo',
        '8. Zeca - Pássaro brasileiro',
        '9. Piupiu - Canto melodioso',
        '10. Voadora - Energia alada',
        '11. Dançarina - Ritmo próprio',
        '12. Saltitante - Energia voadora',
        '13. Alegria - Felicidade voadora',
        '14. Foguete - Velocidade máxima',
        '15. Voador - Mestre do ar',
        '16. Chocolate - Doce voador',
        '17. Caramelo - Doce alado',
        '18. Pretinho - Preto veloz',
        '19. Branco - Branco voador',
        '20. Amarelinho - Amarelo cantador'
      ],
      'Preguiçoso': [
        '1. Soneca - Descanso alado',
        '2. Preguiçoso - Vive no poleiro',
        '3. Cochilinho - Sempre dormindo',
        '4. Moleque - Fofo e preguiçoso',
        '5. Almofadinha - Conforto máximo',
        '6. Sonequinha - Rainha do descanso',
        '7. Almofadinha - Vive no poleiro',
        '8. Cochilinho - Sempre descansando',
        '9. Moleque - Fofo e preguiçoso',
        '10. Preguicinha - Arte da preguiça',
        '11. Soneca - Descanso alado',
        '12. Preguiçoso - Vive no poleiro',
        '13. Cochilinho - Sempre dormindo',
        '14. Moleque - Fofo e preguiçoso',
        '15. Almofadinha - Conforto máximo',
        '16. Chocolate - Doce dorminhoco',
        '17. Caramelo - Doce preguiçoso',
        '18. Pretinho - Preto mole',
        '19. Branco - Branco preguiçoso',
        '20. Amarelinho - Amarelo dorminhoco'
      ],
      'Real': [
        '1. Fênix - Ave lendária',
        '2. Águia - Rei dos céus',
        '3. Pavão - Esplendor real',
        '4. Cisne - Elegante',
        '5. Condor - Majestoso',
        '6. Falcão - Caçador real',
        '7. Corvo - Ave misteriosa',
        '8. Arara - Ave brasileira',
        '9. Tucano - Bico colorido',
        '10. Papagaio - Fala muito',
        '11. Fênix - Ave lendária',
        '12. Águia - Rei dos céus',
        '13. Pavão - Esplendor real',
        '14. Cisne - Elegante',
        '15. Condor - Majestoso',
        '16. Chocolate - Doce majestoso',
        '17. Caramelo - Doce elegante',
        '18. Pretinho - Preto real',
        '19. Branco - Branco nobre',
        '20. Amarelinho - Amarelo distinto'
      ],
      'Bobo': [
        '1. Bobinho - Risadas aladas',
        '2. Trapalhão - Desajeitado voador',
        '3. Maluquinho - Ideias loucas',
        '4. Doidinho - Alegria voadora',
        '5. Bagunceiro - Caos no ar',
        '6. Pateta - Engraçado voador',
        '7. Goofy - Bobo clássico',
        '8. Bobão - Muito bobo',
        '9. Trapaceiro - Sempre aprontando',
        '10. Malandrinho - Esperto bobo',
        '11. Bobinho - Risadas aladas',
        '12. Trapalhão - Desajeitado voador',
        '13. Maluquinho - Ideias loucas',
        '14. Doidinho - Alegria voadora',
        '15. Bagunceiro - Caos no ar',
        '16. Chocolate - Doce bobo',
        '17. Caramelo - Doce maluco',
        '18. Pretinho - Preto engraçado',
        '19. Branco - Branco pateta',
        '20. Amarelinho - Amarelo bobo'
      ],
      'Valente': [
        '1. Guerreiro - Corajoso alado',
        '2. Bravo - Valente',
        '3. Herói - Salvador',
        '4. Campeão - Vencedor',
        '5. Invencível - Imbatível',
        '6. Falcão - Caçador valente',
        '7. Águia - Rei dos céus',
        '8. Guerreiro - Corajoso alado',
        '9. Bravo - Valente',
        '10. Herói - Salvador',
        '11. Campeão - Vencedor',
        '12. Invencível - Imbatível',
        '13. Falcão - Caçador valente',
        '14. Águia - Rei dos céus',
        '15. Guerreiro - Corajoso alado',
        '16. Chocolate - Doce valente',
        '17. Caramelo - Doce guerreiro',
        '18. Pretinho - Preto corajoso',
        '19. Branco - Branco bravo',
        '20. Amarelinho - Amarelo herói'
      ]
    },
    'Coelho': {
      'Brincalhão': [
        '1. Saltitante - Energia puladora',
        '2. Pula-Pula - Salta tudo',
        '3. Dançarino - Ritmo próprio',
        '4. Foguete - Velocidade máxima',
        '5. Alegria - Felicidade pura',
        '6. Pernalonga - Coelho esperto',
        '7. Roger - Coelho malandro',
        '8. Coelhinho - Sempre pulando',
        '9. Saltador - Mestre dos saltos',
        '10. Dançarina - Ritmo próprio',
        '11. Foguete - Velocidade máxima',
        '12. Alegria - Felicidade pura',
        '13. Saltitante - Energia puladora',
        '14. Pula-Pula - Salta tudo',
        '15. Dançarino - Ritmo próprio',
        '16. Chocolate - Doce saltitante',
        '17. Caramelo - Doce pulador',
        '18. Pretinho - Preto veloz',
        '19. Branco - Branco brincalhão',
        '20. Amarelinho - Amarelo energético'
      ],
      'Preguiçoso': [
        '1. Sonequinha - Rainha do descanso',
        '2. Almofadinha - Vive na toca',
        '3. Cochilinho - Sempre dormindo',
        '4. Molezinha - Fofo e preguiçoso',
        '5. Preguicinha - Arte da preguiça',
        '6. Soneca - Rainha do descanso',
        '7. Almofada - Vive na toca',
        '8. Cochilo - Sempre dormindo',
        '9. Puff - Fofo e mole',
        '10. Mingau - Mole e quentinho',
        '11. Bolor - Rei da preguiça',
        '12. Sonequinha - Rainha do descanso',
        '13. Almofadinha - Vive na toca',
        '14. Cochilinho - Sempre dormindo',
        '15. Molezinha - Fofo e preguiçoso',
        '16. Chocolate - Doce preguiçoso',
        '17. Caramelo - Doce mole',
        '18. Pretinho - Preto dorminhoco',
        '19. Branco - Branco preguiçoso',
        '20. Amarelinho - Amarelo dorminhoco'
      ],
      'Real': [
        '1. Princesa - Nobre coelhinha',
        '2. Lady - Elegante',
        '3. Duquesa - Classe pura',
        '4. Marquesa - Sofisticada',
        '5. Condessa - Distinta',
        '6. Rainha - Majestosa',
        '7. Princesa - Herdeira real',
        '8. Lady - Nobre senhora',
        '9. Duquesa - Classe superior',
        '10. Marquesa - Sofisticada',
        '11. Condessa - Distinta',
        '12. Faraó - Rei antigo',
        '13. Imperador - Soberano',
        '14. Rainha - Majestosa',
        '15. Príncipe - Herdeiro real',
        '16. Chocolate - Doce nobre',
        '17. Caramelo - Doce elegante',
        '18. Pretinho - Preto sofisticado',
        '19. Branco - Branco real',
        '20. Amarelinho - Amarelo distinto'
      ],
      'Bobo': [
        '1. Bobinho - Risadas saltitantes',
        '2. Trapalhão - Desajeitado fofo',
        '3. Maluquinho - Ideias malucas',
        '4. Doidinho - Alegria pura',
        '5. Bagunceiro - Caos fofo',
        '6. Pateta - Engraçado',
        '7. Goofy - Bobo clássico',
        '8. Bobão - Muito bobo',
        '9. Trapaceiro - Sempre aprontando',
        '10. Malandrinho - Esperto bobo',
        '11. Bobinho - Risadas saltitantes',
        '12. Trapalhão - Desajeitado fofo',
        '13. Maluquinho - Ideias malucas',
        '14. Doidinho - Alegria pura',
        '15. Bagunceiro - Caos fofo',
        '16. Chocolate - Doce bobo',
        '17. Caramelo - Doce maluco',
        '18. Pretinho - Preto engraçado',
        '19. Branco - Branco pateta',
        '20. Amarelinho - Amarelo bobo'
      ],
      'Valente': [
        '1. Guerreirinho - Corajoso',
        '2. Bravo - Valente',
        '3. Herói - Salvador',
        '4. Campeão - Vencedor',
        '5. Invencível - Imbatível',
        '6. Zeus - Rei dos deuses',
        '7. Apollo - Deus grego',
        '8. Spartacus - Guerreiro',
        '9. Conan - Bárbaro',
        '10. Achilles - Herói grego',
        '11. Leónidas - Rei espartano',
        '12. Maximus - Gladiador',
        '13. Brutus - Forte romano',
        '14. César - Imperador',
        '15. Odin - Deus nórdico',
        '16. Chocolate - Doce valente',
        '17. Caramelo - Doce guerreiro',
        '18. Pretinho - Preto corajoso',
        '19. Branco - Branco bravo',
        '20. Amarelinho - Amarelo herói'
      ]
    },
    'Hamster': {
      'Brincalhão': [
        '1. Rodinha - Energia infinita',
        '2. Bolinha - Sempre rolando',
        '3. Dançarino - Ritmo próprio',
        '4. Foguete - Velocidade máxima',
        '5. Alegria - Felicidade pura',
        '6. Rodador - Mestre das rodas',
        '7. Bolinha - Sempre rolando',
        '8. Dançarino - Ritmo próprio',
        '9. Foguete - Velocidade máxima',
        '10. Alegria - Felicidade pura',
        '11. Rodinha - Energia infinita',
        '12. Bolinha - Sempre rolando',
        '13. Dançarino - Ritmo próprio',
        '14. Foguete - Velocidade máxima',
        '15. Alegria - Felicidade pura',
        '16. Chocolate - Doce rodador',
        '17. Caramelo - Doce rolante',
        '18. Pretinho - Preto veloz',
        '19. Branco - Branco brincalhão',
        '20. Amarelinho - Amarelo energético'
      ],
      'Preguiçoso': [
        '1. Sonequinha - Rainha do descanso',
        '2. Almofadinha - Vive na cama',
        '3. Cochilinho - Sempre dormindo',
        '4. Molezinha - Fofo e preguiçoso',
        '5. Preguicinha - Arte da preguiça',
        '6. Soneca - Rainha do descanso',
        '7. Almofada - Vive na cama',
        '8. Cochilo - Sempre dormindo',
        '9. Puff - Fofo e mole',
        '10. Mingau - Mole e quentinho',
        '11. Bolor - Rei da preguiça',
        '12. Sonequinha - Rainha do descanso',
        '13. Almofadinha - Vive na cama',
        '14. Cochilinho - Sempre dormindo',
        '15. Molezinha - Fofo e preguiçoso',
        '16. Chocolate - Doce preguiçoso',
        '17. Caramelo - Doce mole',
        '18. Pretinho - Preto dorminhoco',
        '19. Branco - Branco preguiçoso',
        '20. Amarelinho - Amarelo dorminhoco'
      ],
      'Real': [
        '1. Princesa - Nobre hamster',
        '2. Lady - Elegante',
        '3. Duquesa - Classe pura',
        '4. Marquesa - Sofisticada',
        '5. Condessa - Distinta',
        '6. Rainha - Majestosa',
        '7. Princesa - Herdeira real',
        '8. Lady - Nobre senhora',
        '9. Duquesa - Classe superior',
        '10. Marquesa - Sofisticada',
        '11. Condessa - Distinta',
        '12. Faraó - Rei antigo',
        '13. Imperador - Soberano',
        '14. Rainha - Majestosa',
        '15. Príncipe - Herdeiro real',
        '16. Chocolate - Doce nobre',
        '17. Caramelo - Doce elegante',
        '18. Pretinho - Preto sofisticado',
        '19. Branco - Branco real',
        '20. Amarelinho - Amarelo distinto'
      ],
      'Bobo': [
        '1. Bobinho - Risadas rolinhas',
        '2. Trapalhão - Desajeitado fofo',
        '3. Maluquinho - Ideias malucas',
        '4. Doidinho - Alegria pura',
        '5. Bagunceiro - Caos fofo',
        '6. Pateta - Engraçado',
        '7. Goofy - Bobo clássico',
        '8. Bobão - Muito bobo',
        '9. Trapaceiro - Sempre aprontando',
        '10. Malandrinho - Esperto bobo',
        '11. Bobinho - Risadas rolinhas',
        '12. Trapalhão - Desajeitado fofo',
        '13. Maluquinho - Ideias malucas',
        '14. Doidinho - Alegria pura',
        '15. Bagunceiro - Caos fofo',
        '16. Chocolate - Doce bobo',
        '17. Caramelo - Doce maluco',
        '18. Pretinho - Preto engraçado',
        '19. Branco - Branco pateta',
        '20. Amarelinho - Amarelo bobo'
      ],
      'Valente': [
        '1. Guerreirinho - Corajoso',
        '2. Bravo - Valente',
        '3. Herói - Salvador',
        '4. Campeão - Vencedor',
        '5. Invencível - Imbatível',
        '6. Zeus - Rei dos deuses',
        '7. Apollo - Deus grego',
        '8. Spartacus - Guerreiro',
        '9. Conan - Bárbaro',
        '10. Achilles - Herói grego',
        '11. Leónidas - Rei espartano',
        '12. Maximus - Gladiador',
        '13. Brutus - Forte romano',
        '14. César - Imperador',
        '15. Odin - Deus nórdico',
        '16. Chocolate - Doce valente',
        '17. Caramelo - Doce guerreiro',
        '18. Pretinho - Preto corajoso',
        '19. Branco - Branco bravo',
        '20. Amarelinho - Amarelo herói'
      ]
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    
    // Simular delay de processamento
    setTimeout(() => {
      const allNames = petNames[petType as keyof typeof petNames][personality as keyof typeof petNames[keyof typeof petNames]];
      // Selecionar 10 nomes aleatórios
      const shuffled = [...allNames].sort(() => 0.5 - Math.random());
      const selectedNames = shuffled.slice(0, 10).map((name, index) => {
        const num = index + 1;
        return name.replace(/^\d+\./, `${num}.`);
      });
      setResult(selectedNames.join('\n'));
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-purple-500/30 px-4 py-2 rounded-full text-purple-200 text-sm font-semibold border border-purple-400/30">
                    <Bot size={18} />
                    <span>Gerador de Nomes Inteligente</span>
                </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Novo Pet? Sem Nome? 😱
              </h2>
              <p className="text-purple-200 text-lg">
                Não entre em pânico! Nosso gerador inteligente está aqui para sugerir 10 nomes perfeitos para seu novo melhor amigo baseado na vibe única dele.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">É um(a)...</label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option className="text-gray-900" value="Cachorro">Cachorro 🐶</option>
                    <option className="text-gray-900" value="Gato">Gato 🐱</option>
                    <option className="text-gray-900" value="Pássaro">Pássaro 🦜</option>
                    <option className="text-gray-900" value="Coelho">Coelho 🐰</option>
                    <option className="text-gray-900" value="Hamster">Hamster 🐹</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">E é totalmente...</label>
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full bg-white/5 border border-purple-300/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option className="text-gray-900" value="Brincalhão">Brincalhão e Selvagem ⚡</option>
                    <option className="text-gray-900" value="Preguiçoso">Totalmente Preguiçoso 🛋️</option>
                    <option className="text-gray-900" value="Real">Chique e Real 👑</option>
                    <option className="text-gray-900" value="Bobo">Bobo e Desajeitado 🤪</option>
                    <option className="text-gray-900" value="Valente">Valente e Corajoso 🦁</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> Gerando 10 nomes...
                    </>
                  ) : (
                    <>
                        <Sparkles size={20} /> Gerar 10 Nomes!
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-gray-900 rounded-2xl p-6 min-h-[300px] border border-gray-700 shadow-inner flex flex-col">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-500 font-mono">nome-pet-generator</span>
                </div>
                <div className="font-mono text-sm text-green-400 whitespace-pre-line leading-relaxed flex-1">
                  {result ? result : (
                    <span className="text-gray-600">
                      // Aguardando detalhes do pet...<br/>
                      // Sistema pronto para gerar 10 nomes! 🤖<br/>
                      // Selecione as opções à esquerda.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeminiPetNamer;
