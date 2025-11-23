import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DonateItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: 'vip' | 'currency' | 'items' | 'special';
  image: string;
}

interface CartItem extends DonateItem {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const donateItems: DonateItem[] = [
    {
      id: 1,
      name: 'VIP Статус',
      description: 'Эксклюзивные привилегии на 30 дней',
      price: 499,
      discount: 20,
      category: 'vip',
      image: '⭐'
    },
    {
      id: 2,
      name: 'Премиум VIP',
      description: 'Все привилегии + бонусы',
      price: 999,
      category: 'vip',
      image: '👑'
    },
    {
      id: 3,
      name: '1000 Кристаллов',
      description: 'Игровая валюта',
      price: 99,
      category: 'currency',
      image: '💎'
    },
    {
      id: 4,
      name: '5000 Кристаллов',
      description: 'Игровая валюта + бонус 10%',
      price: 449,
      discount: 10,
      category: 'currency',
      image: '💎'
    },
    {
      id: 5,
      name: 'Легендарный меч',
      description: 'Уникальное оружие с эффектами',
      price: 299,
      category: 'items',
      image: '⚔️'
    },
    {
      id: 6,
      name: 'Набор стартера',
      description: 'Все необходимое для начала',
      price: 199,
      discount: 30,
      category: 'special',
      image: '🎁'
    }
  ];

  const promoCodes = {
    'GAME2024': 15,
    'NEWBIE': 25,
    'VIP50': 50
  };

  const addToCart = (item: DonateItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({
      title: "Добавлено в корзину!",
      description: `${item.name} добавлен`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code as keyof typeof promoCodes]) {
      setPromoDiscount(promoCodes[code as keyof typeof promoCodes]);
      toast({
        title: "Промокод активирован!",
        description: `Скидка ${promoCodes[code as keyof typeof promoCodes]}% применена`,
      });
    } else {
      toast({
        title: "Неверный промокод",
        description: "Попробуйте другой код",
        variant: "destructive"
      });
    }
  };

  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => {
      const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    if (promoDiscount > 0) {
      total = total * (1 - promoDiscount / 100);
    }
    
    return total;
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return donateItems;
    return donateItems.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl animate-float">🎮</div>
            <h1 className="text-2xl font-heading font-bold text-primary">GameStore</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#donates" className="text-foreground hover:text-primary transition-colors">Донаты</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
            <a href="#support" className="text-foreground hover:text-primary transition-colors">Поддержка</a>
            <Button variant="outline" size="sm" className="gap-2">
              <Icon name="User" size={16} />
              Профиль
            </Button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 relative">
                <Icon name="ShoppingCart" size={16} />
                Корзина
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
                <SheetDescription>Ваши покупки</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.image}</div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-primary">{item.price * item.quantity}₽</p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button onClick={applyPromoCode} variant="secondary">
                          Применить
                        </Button>
                      </div>
                      
                      {promoDiscount > 0 && (
                        <Badge variant="secondary" className="w-full justify-center py-2">
                          Скидка {promoDiscount}% активна!
                        </Badge>
                      )}
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{calculateTotal().toFixed(0)}₽</span>
                      </div>
                      
                      <Button className="w-full" size="lg">
                        <Icon name="CreditCard" size={20} className="mr-2" />
                        Оплатить
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 animate-glow" variant="secondary">
            🔥 Специальное предложение
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Магазин донатов
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Получите эксклюзивные привилегии, валюту и предметы. Используйте промокоды для дополнительных скидок!
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Icon name="Zap" size={20} />
              Смотреть донаты
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Icon name="Gift" size={20} />
              Промокоды
            </Button>
          </div>
        </div>
      </section>

      <section id="donates" className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
              <TabsTrigger value="currency">Валюта</TabsTrigger>
              <TabsTrigger value="items">Предметы</TabsTrigger>
              <TabsTrigger value="special">Акции</TabsTrigger>
            </TabsList>

            {['all', 'vip', 'currency', 'items', 'special'].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterByCategory(category).map((item) => (
                    <Card key={item.id} className="hover-lift relative overflow-hidden group">
                      {item.discount && (
                        <Badge className="absolute top-4 right-4 z-10 bg-accent animate-pulse">
                          -{item.discount}%
                        </Badge>
                      )}
                      <CardHeader>
                        <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                          {item.image}
                        </div>
                        <CardTitle className="text-center">{item.name}</CardTitle>
                        <CardDescription className="text-center">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          {item.discount ? (
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                {(item.price * (1 - item.discount / 100)).toFixed(0)}₽
                              </span>
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                {item.price}₽
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                          )}
                        </div>
                        <Button 
                          className="w-full gap-2" 
                          onClick={() => addToCart(item)}
                        >
                          <Icon name="ShoppingCart" size={16} />
                          В корзину
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Активные промокоды</h2>
            <p className="text-muted-foreground">Используйте промокоды для получения скидки</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="text-4xl mb-2">🎮</div>
                <CardTitle>GAME2024</CardTitle>
                <CardDescription>Скидка 15%</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="text-4xl mb-2">🌟</div>
                <CardTitle>NEWBIE</CardTitle>
                <CardDescription>Скидка 25% для новичков</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover-lift animate-glow">
              <CardHeader>
                <div className="text-4xl mb-2">👑</div>
                <CardTitle>VIP50</CardTitle>
                <CardDescription>Скидка 50% на VIP</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Частые вопросы</h2>
            <p className="text-muted-foreground">Ответы на популярные вопросы</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Как активировать промокод?
              </AccordionTrigger>
              <AccordionContent>
                Добавьте товары в корзину, введите промокод в специальное поле и нажмите "Применить". Скидка автоматически рассчитается.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Можно ли использовать несколько промокодов?
              </AccordionTrigger>
              <AccordionContent>
                Одновременно можно использовать только один промокод. Скидки от промокода суммируются со скидками на товары.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Как долго действует VIP статус?
              </AccordionTrigger>
              <AccordionContent>
                VIP статус действует 30 дней с момента активации. Вы можете продлить его в любой момент.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Какие способы оплаты доступны?
              </AccordionTrigger>
              <AccordionContent>
                Мы принимаем банковские карты, электронные кошельки и криптовалюту. Все платежи защищены.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section id="support" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-4xl font-heading font-bold mb-4">Нужна помощь?</h2>
          <p className="text-muted-foreground mb-8">
            Наша команда поддержки готова помочь вам 24/7
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Icon name="MessageCircle" size={20} />
              Написать в чат
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Icon name="Mail" size={20} />
              Email поддержка
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 GameStore. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
