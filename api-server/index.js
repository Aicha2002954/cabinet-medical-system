const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let cart = [];

const products = [

  {
    productID: "P001",
    productTitle: "Christian Louboutin",
    productImage: "assets/images/christian_louboutin.jpg",
    category: "hauts",
    quantity: 10,
    productPrice: "600 $",
     offer: {
    isActive: true, 
    discountPercentage: 20, 
    newPrice: "480 $" 
  },
    productDescription: "Talons hauts signés Christian Louboutin, élégance inégalée et confort assuré."
  },
  {
    productID: "P002",
    productTitle: "Escarpins Chanel Blanc",
    productImage: "assets/images/Escarpins blanc.jpg",
    category: "hauts",
    quantity: 5,
    productPrice: "1500 $",
     offer: {
    isActive: true,
    discountPercentage: 75,
    newPrice: "112 $"
  },
    productDescription: "Escarpins blancs Chanel, alliant luxe et féminité.",
    
  

  },
  {
    productID: "P003",
    productTitle: "Escarpins Gucci Classiques",
    productImage: "assets/images/Escarpins Gucci.jpg",
    category: "hauts",
    quantity: 7,
    productPrice: "800 $",
     offer: {
    isActive: true, 
    discountPercentage: 20, 
    newPrice: "480 $" 
  },
    productDescription: "Modèle Gucci intemporel, parfait pour les looks élégants."
  },
  {
    productID: "P004",
    productTitle: "Escarpins de Mariage",
    productImage: "assets/images/Escarpins mariage.jpg",
    category: "hauts",
    quantity: 12,
    productPrice: "1200 $",
    productDescription: "Escarpins raffinés, idéals pour sublimer une robe de mariée.",
       offer: { isActive: true, discountPercentage: 50, newPrice: "510 $" }
  },
  {
    productID: "P005",
    productTitle: "Escarpins Tlon Modernes",
    productImage: "assets/images/Escarpins Tlon.jpg",
    category: "hauts",
    quantity: 8,
    productPrice: "500 $",
    productDescription: "Modèle contemporain combinant design audacieux et confort.",
     offer: {
      isActive: false
    }
  },
  {
    productID: "P006",
    productTitle: "Escarpins Huelva Costa",
    productImage: "assets/images/Huelva_costa.jpg",
    category: "hauts",
    quantity: 4,
    productPrice: "809 $",
    productDescription: "Élégants escarpins Huelva Costa au style chic et affirmé.",
     offer: {
      isActive: false
    }
  },
  {
    productID: "P007",
    productTitle: "Talons Lina Beige",
    productImage: "assets/images/Talons Lina -Beige.avif",
    category: "hauts",
    quantity: 9,
    productPrice: "620 $",
    productDescription: "Talons beiges Lina, un essentiel pour vos tenues sobres et raffinées.",
     offer: { isActive: true, discountPercentage: 10, newPrice: "558 $" }
  
  },
  {
    productID: "P008",
    productTitle: "Talons Sofia Noir",
    productImage: "assets/images/Talons Sofia - Noir.avif",
    category: "hauts",
    quantity: 6,
    productPrice: "670 $",
    productDescription: "Talons noirs Sofia, pour un look classe et intemporel.",
     offer: {
      isActive: false
    }
  },

  {
    productID: "P009",
    productTitle: "Chaussures Gucci",
    productImage: "assets/images/chassures plates1.jpg",
    category: "chaussures",
    quantity: 10,
    productPrice: "700 $",
    productDescription: "Chaussures plates Gucci, confort de luxe au quotidien.",
     offer: {
      isActive: false
    }
  },
  {
    productID: "P010",
    productTitle: "Chaussures Louboutin",
    productImage: "assets/images/chassures plates2.jpg",
    category: "chaussures",
    quantity: 10,
    productPrice: "900 $",
    offer: {
    isActive: true, 
    discountPercentage: 35, 
    newPrice: "434 $"
  },
    productDescription: "Louboutin plats pour une touche raffinée sans talons."
  },
  {
    productID: "P011",
    productTitle: "Chaussure plates Casual",
    productImage: "assets/images/chassures plates3.jpg",
    category: "chaussures",
    quantity: 10,
    productPrice: "700 $",
    offer: {
    isActive: true, 
    discountPercentage: 57, 
    newPrice: "246 $" 
  },
    productDescription: "Chaussures plates stylées, parfaites pour tous les jours."
  },

  {
    productID: "P012",
    productTitle: "Sandales Chanel Été",
    productImage: "assets/images/sandale plates1.jpg",
    category: "sandales",
    quantity: 5,
    productPrice: "500 $",
    productDescription: "Sandales Chanel parfaites pour l’été, élégantes et légères.",
     offer: {
    isActive: true,
    discountPercentage: 20,
    newPrice: "400 $"
  },
  },
  {
    productID: "P013",
    productTitle: "Sandales Louis Vuitton-Classique",
    productImage: "assets/images/sandale plates2.jpg",
    category: "sandales",
    quantity: 8,
    productPrice: "300 $",
    productDescription: "Modèle basique Louis Vuitton, confortable et stylé.",
    offer: {
      isActive: false
    },
    offer: {
      isActive: false
    }
  },
  {
    productID: "P014",
    productTitle: "Sandales Louis Vuitton - Tressées",
    productImage: "assets/images/sandale plates6.jpg",
    category: "sandales",
    quantity: 8,
    productPrice: "400 $",
    productDescription: "Sandales tressées Louis Vuitton, design élégant.",
    offer: {
      isActive: false
    }
  },
  {
    productID: "P015",
    productTitle: "Sandales Louis Vuitton - Simples",
    productImage: "assets/images/sandale plates5.jpg",
    category: "sandales",
    quantity: 8,
    productPrice: "100 $",
    productDescription: "Modèle épuré Louis Vuitton à petit prix.",
    offer: {
      isActive: false
    }
  },
  {
    productID: "P016",
    productTitle: "Sandales Décontractées",
    productImage: "assets/images/sandale plates3.jpg",
    category: "sandales",
    quantity: 10,
    productPrice: "760 $",
    productDescription: "Sandales plates modernes, idéales pour un style relax.",
    offer: {
      isActive: false
    }
  },

  {
    productID: "P021",
    productTitle: "Bottes Gucci _ Luxe",
    productImage: "assets/images/bottes3.jpg",
    category: "bottes",
    quantity: 12,
    productPrice: "790 $",
    productDescription: "Bottes haut de gamme Gucci, pour un hiver stylé.",
    offer: {
    isActive: true,
    discountPercentage: 40,
    newPrice: "206 $"
  }
  },
  {
    productID: "P022",
    productTitle: "Bottes en Daim Hiver",
    productImage: "assets/images/bottes4.jpg",
    category: "bottes",
    quantity: 14,
    productPrice: "500 $",
    productDescription: "Bottes douces et chaudes, idéales pour l’hiver.",
    offer: {
      isActive: false
    }
  },

  {
    productID: "P019",
    productTitle: "Bottes Branchées d’Hiver",
    productImage: "assets/images/bottes1.jpg",
    category: "bottes",
    quantity: 14,
    productPrice: "790 $",
    productDescription: "Bottes stylées pour rester au chaud avec élégance.",
    offer: {
      isActive: false
    }
  },
  {
    productID: "P020",
    productTitle: "Bottes Zara Élégantes",
    productImage: "assets/images/bottes2.jpg",
    category: "bottes",
    quantity: 2,
    productPrice: "80 $",
    productDescription: "Modèle Zara simple, parfait pour un usage quotidien.",
    offer: {
      isActive: false
    }
  },
 
   {
    productID: "P017",
    productTitle: "Sandales Compensées Louis Vuitton - Beige",
    productImage: "assets/images/chassures com1.jpg",
    category: "compenses",
    quantity: 4,
    productPrice: "258 $",
    productDescription: "Compensées LV beige, idéales pour un look chic et confortable.",
   
  },
  {
    productID: "P018",
    productTitle: "Sandales Compensées Louis Vuitton - Marron",
    productImage: "assets/images/chassures com2.jpg",
    category: "compenses",
    quantity: 7,
    productPrice: "479 $",
    productDescription: "Compensées Louis Vuitton en cuir marron, style affirmé.",
   
  }
];




app.get("/api/products", (req, res) => {
  res.json(products);
});


app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find(p => p.productID === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});


app.post("/api/cart", (req, res) => {
  cart = req.body;
  setTimeout(() => res.status(201).send(), 20);
});


app.get("/api/cart", (req, res) => {
  res.json(cart);
});

const users = {
  "aichafraoua@email.com": {
    firstName: "aicha",
    lastName: "fraoua",
    email: "aichafraoua@email.com",
    password: "aicha2002",
    userId: "1"
  }
};


app.post("/api/signin", (req, res) => {
  const user = users[req.body.email];
  if (user && user.password === req.body.password) {
    res.status(200).send({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(401).send("Invalid user credentials.");
  }
});
  




app.post("/api/checkout", (req, res) => {
  const { nomComplet, email, adresse, paymentMethod, cartItems } = req.body;

  console.log("✅ Nouvelle commande reçue :");
  console.log("Nom:", nomComplet);
  console.log("Email:", email);
  console.log("Adresse:", adresse);
  console.log("Méthode de paiement:", paymentMethod);
  console.log("Produits commandés:", cartItems);

  res.status(200).json({ message: "Commande reçue avec succès !" });
});

const port = 3000;

app.listen(port, () => console.log(`API Server listening on port ${port}`));

