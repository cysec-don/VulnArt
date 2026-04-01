import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getRawDb } from '@/lib/db-raw';

export async function POST() {
  try {
    const rawDb = getRawDb();

    // Clear existing data
    rawDb.exec('DELETE FROM Comment');
    rawDb.exec('DELETE FROM Product');
    rawDb.exec('DELETE FROM User');

    // Seed users (collectors)
    const users = [
      {
        id: 'usr_admin_001',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'elena.vasquez@vulnart.com',
        ssn: '000-00-0001',
        creditCard: '4532-XXXX-XXXX-0001',
        address: '452 Park Avenue, New York, NY 10022',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'usr_user_001',
        username: 'user',
        password: 'password123',
        role: 'user',
        email: 'marcus.chen@vulnart.com',
        ssn: '000-00-0002',
        creditCard: '4532-XXXX-XXXX-0002',
        address: '88 Queen Street West, Toronto, ON M5H 2B1',
        createdAt: '2024-02-15T00:00:00.000Z',
      },
      {
        id: 'usr_mgr_001',
        username: 'manager',
        password: 'manager123',
        role: 'manager',
        email: 'sarah.mitchell@vulnart.com',
        ssn: '000-00-0003',
        creditCard: '4532-XXXX-XXXX-0003',
        address: '14 rue de Rivoli, 75001 Paris, France',
        createdAt: '2024-03-20T00:00:00.000Z',
      },
      {
        id: 'usr_dbadmin_001',
        username: 'dbadmin',
        password: 'dbadmin123',
        role: 'dbadmin',
        email: 'oliver.blackwood@vulnart.com',
        ssn: '000-00-0004',
        creditCard: '4532-XXXX-XXXX-0004',
        address: '22 Mayfair Place, London W1K 3PA, United Kingdom',
        createdAt: '2024-04-10T00:00:00.000Z',
      },
    ];

    for (const user of users) {
      rawDb.prepare(`
        INSERT INTO User (id, username, password, role, email, ssn, creditCard, address, createdAt)
        VALUES ('${user.id}', '${user.username}', '${user.password}', '${user.role}', '${user.email}', '${user.ssn}', '${user.creditCard}', '${user.address}', '${user.createdAt}')
      `).run();
    }

    // Seed products (16 artworks)
    const products = [
      {
        id: 'prod_001',
        name: 'Crimson Resonance',
        description: 'Bold abstract expressionist piece by Elena Vasquez. Crimson and gold interplay on deep navy canvas creates a mesmerizing visual rhythm.',
        price: 12500,
        category: 'Abstract',
      },
      {
        id: 'prod_002',
        name: 'Temporal Drift',
        description: 'Surrealist landscape by Marcus Chen. Melting time over a dreamlike ocean — a contemporary vision of the subconscious.',
        price: 18750,
        category: 'Surrealism',
      },
      {
        id: 'prod_003',
        name: 'Golden Ratio',
        description: 'Minimalist geometric masterpiece by Sarah Mitchell. Navy blue and gold composition inspired by mathematical perfection.',
        price: 8900,
        category: 'Minimalist',
      },
      {
        id: 'prod_004',
        name: 'Sakura Dreams',
        description: 'Delicate impressionist watercolor by Yuki Tanaka. Japanese cherry blossoms captured in full ephemeral bloom.',
        price: 6200,
        category: 'Impressionist',
      },
      {
        id: 'prod_005',
        name: 'Neon Requiem',
        description: 'Vibrant cyberpunk digital art by Alex Rivera. Purple and cyan neon cityscape of a not-so-distant future.',
        price: 15000,
        category: 'Contemporary',
      },
      {
        id: 'prod_006',
        name: 'The Duchess',
        description: 'Classical Renaissance portrait by Isabella Romano. An elegant woman adorned with golden jewelry, dramatic chiaroscuro lighting.',
        price: 32000,
        category: 'Classical',
      },
      {
        id: 'prod_007',
        name: 'Emerald Depths',
        description: 'Luxe abstract fluid art by Oliver Blackwood. Emerald green and black marble texture evokes natural stone formations.',
        price: 11500,
        category: 'Abstract',
      },
      {
        id: 'prod_008',
        name: 'Pop Explosion',
        description: 'Bold contemporary pop art by Jamie Watts. Bright primary colors in a Roy Lichtenstein-inspired comic book aesthetic.',
        price: 7500,
        category: 'Pop Art',
      },
      {
        id: 'prod_009',
        name: 'Earth Rhythms',
        description: 'Warm abstract painting by Amara Okafor. Geometric patterns inspired by ancient cultural motifs with rich earth tones.',
        price: 9800,
        category: 'Contemporary',
      },
      {
        id: 'prod_010',
        name: 'Golden Peaks',
        description: 'Atmospheric landscape by Thomas Ashford. Misty mountains bathed in golden hour light, dramatic romantic cloudscape.',
        price: 14200,
        category: 'Landscape',
      },
      {
        id: 'prod_011',
        name: 'Cosmic Nebula',
        description: 'Ethereal space painting by Dr. Aisha Patel. Swirling galaxies and nebulae in deep purple and gold astronomical fine art.',
        price: 22000,
        category: 'Space Art',
      },
      {
        id: 'prod_012',
        name: 'Cubist Reverie',
        description: 'Cubist still life by Jean-Pierre Moreau. Fragmented forms and bold geometric composition in the tradition of Picasso.',
        price: 16500,
        category: 'Cubism',
      },
      {
        id: 'prod_013',
        name: 'Ocean Horizon',
        description: 'Serene seascape by Catalina Reyes. Dramatic waves meeting golden sunset cliffs, impressionist coastal masterpiece.',
        price: 11000,
        category: 'Impressionist',
      },
      {
        id: 'prod_014',
        name: 'Autumn Impasto',
        description: 'Textured abstract by Henrik Larsson. Thick palette knife technique with warm autumn reds, oranges, and gold.',
        price: 8400,
        category: 'Abstract',
      },
      {
        id: 'prod_015',
        name: 'Enchanted Grove',
        description: 'Fantasy landscape by Luna Kimura. Bioluminescent woodland with glowing mushrooms under moonlight, magical atmosphere.',
        price: 13500,
        category: 'Fantasy',
      },
      {
        id: 'prod_016',
        name: 'Zen Waters',
        description: 'Minimalist ink wash by Master Takeshi. Traditional sumi-e bamboo and koi fish in meditative black ink on cream paper.',
        price: 7800,
        category: 'Minimalist',
      },
    ];

    for (const product of products) {
      rawDb.prepare(`
        INSERT INTO Product (id, name, description, price, category)
        VALUES ('${product.id}', '${product.name}', '${product.description}', ${product.price}, '${product.category}')
      `).run();
    }

    // Seed comments (art reviews)
    const comments = [
      {
        id: 'cmt_001',
        author: 'ArtCollector99',
        content: 'Absolutely stunning piece! The crimson and gold interplay is mesmerizing. A worthy centerpiece for any serious collection.',
        createdAt: '2024-05-01T10:00:00.000Z',
      },
      {
        id: 'cmt_002',
        author: 'GalleryOwnerNYC',
        content: 'Vasquez outdid herself with this one. The depth of emotion conveyed through such bold color choices is extraordinary.',
        createdAt: '2024-05-02T14:30:00.000Z',
      },
      {
        id: 'cmt_003',
        author: 'ModernArtFan',
        content: 'The texture and depth of this painting must be seen in person. Photos simply do not do it justice!',
        createdAt: '2024-05-03T09:15:00.000Z',
      },
    ];

    for (const comment of comments) {
      rawDb.prepare(`
        INSERT INTO Comment (id, author, content, createdAt)
        VALUES ('${comment.id}', '${comment.author}', '${comment.content}', '${comment.createdAt}')
      `).run();
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: users.length,
        products: products.length,
        comments: comments.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    );
  }
}
