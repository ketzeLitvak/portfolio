import {
  ArrowRight,
  Calculator,
  Check,
  FlaskConical,
  Package,
  Plug,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import type { ShippingProviderId } from '../../../models/injectionExperiment';

import { useInjectionExperimentPresenter } from '../../../presenters/useInjectionExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './InjectionExperimentView.module.css';

const providers = [
  {
    id: 'standard',
    className: 'StandardShipping',
    title: ['Standard', 'Normal'],
    description: ['$4 + $2/kg · 5 days', '$4 + $2/kg · 5 días'],
    icon: Truck,
  },
  {
    id: 'express',
    className: 'ExpressShipping',
    title: ['Express', 'Express'],
    description: ['$8 + $3/kg · 1 day', '$8 + $3/kg · 1 día'],
    icon: Zap,
  },
  {
    id: 'stub',
    className: 'ShippingStub',
    title: ['Test double', 'Doble de prueba'],
    description: ['Always returns $42 · 2 days', 'Siempre devuelve $42 · 2 días'],
    icon: FlaskConical,
  },
] satisfies {
  id: ShippingProviderId;
  className: string;
  title: Text;
  description: Text;
  icon: typeof Truck;
}[];

export function InjectionExperimentView({ language }: ViewProps) {
  const p = useInjectionExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const selected = providers.find((provider) => provider.id === p.provider)!;
  const ProviderIcon = selected.icon;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['Same checkout. Different services.', 'El mismo checkout. Distintos servicios.']}
      description={[
        'Choose who calculates shipping. The checkout code stays the same.',
        'Elegí quién calcula el envío. El código del checkout sigue siendo el mismo.',
      ]}
      docs="https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection"
      explanation={
        <>
          <p>
            {t([
              'CheckoutService receives a ShippingProvider in its constructor. It calls quote(order) through that contract and does not create or select a shipping implementation. The composition root creates the chosen provider and injects it into a new checkout.',
              'CheckoutService recibe un ShippingProvider en su constructor. Llama a quote(order) a través de ese contrato y no crea ni elige una implementación de envío. El punto de composición crea el proveedor elegido y lo inyecta en un nuevo checkout.',
            ])}
          </p>
          <pre className={styles.code}>
            <code>{`interface ShippingProvider {\n  quote(order: ShippingOrder): ShippingQuote;\n}\n\nclass CheckoutService {\n  constructor(private shipping: ShippingProvider) {}\n\n  calculate(order: ShippingOrder) {\n    return this.shipping.quote(order);\n  }\n}\n\nconst shipping = new ${selected.className}();\nconst checkout = new CheckoutService(shipping);`}</code>
          </pre>
          <p>
            {t([
              'The test double is a stub: it returns a fixed response so a checkout test can check predictable results without a delivery service. The tests in this project also inject an independent spy and verify that the checkout forwards the order to it.',
              'El doble de prueba es un stub: devuelve una respuesta fija para probar el checkout con resultados predecibles, sin necesitar un servicio de entrega. Los tests del proyecto también inyectan un spy independiente y verifican que el checkout le pase el pedido.',
            ])}
          </p>
          <p>
            {t([
              'This is manual constructor injection, with local example prices. A DI container can automate construction and manage lifetimes, but the pattern also works without one. In .NET, the same idea is expressed by registering a service interface and injecting it through a constructor.',
              'Esto es inyección manual por constructor, con precios locales de ejemplo. Un contenedor de DI puede automatizar la construcción y administrar los ciclos de vida, pero el patrón también funciona sin uno. En .NET, la misma idea se expresa registrando una interfaz de servicio e inyectándola por constructor.',
            ])}
          </p>
        </>
      }
    >
      <fieldset className={styles.providers}>
        <legend>{t(['Inject a shipping service', 'Inyectá un servicio de envío'])}</legend>
        <div>
          {providers.map(({ id, title, description, icon: Icon }) => (
            <button key={id} aria-pressed={p.provider === id} onClick={() => p.selectProvider(id)}>
              <span>
                <Icon size={17} />
                {t(title)}
                {p.provider === id && <Check size={13} />}
              </span>
              <small>{t(description)}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <p className={styles.selectedDescription}>{t(selected.description)}</p>
      <div className={styles.connection}>
        <article className={styles.consumer}>
          <ShoppingBag size={27} />
          <h3>Checkout</h3>
          <span>{t(['Same application code', 'El mismo código de la aplicación'])}</span>
          <label className={styles.weight}>
            <span>
              <Package size={13} />
              {t(['Package', 'Paquete'])} · {p.weightKg} kg
            </span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={p.weightKg}
              aria-label={t(['Package weight', 'Peso del paquete'])}
              onChange={(event) => p.changeWeight(Number(event.target.value))}
            />
          </label>
        </article>
        <div className={styles.contract}>
          <Plug size={18} />
          <ArrowRight size={18} />
          <span>quote(order)</span>
        </div>
        <article className={styles.dependency}>
          <ProviderIcon size={27} />
          <h3>{t(selected.title)}</h3>
          <span>{t(['Injected dependency', 'Dependencia inyectada'])}</span>
          <code>{selected.className}</code>
        </article>
      </div>
      <p className={ui.note}>
        {t([
          'Both sides use the ShippingProvider contract. Prices are examples.',
          'Ambos lados usan el contrato ShippingProvider. Los precios son de ejemplo.',
        ])}
      </p>
      <div className={ui.actions}>
        <button className={ui.primary} onClick={p.calculate}>
          <Calculator size={16} />
          {t(['Calculate shipping', 'Calcular envío'])}
        </button>
      </div>
      <div className={styles.result} aria-live="polite">
        {p.result ? (
          <>
            <div>
              <small>{t(['Shipping cost', 'Costo de envío'])}</small>
              <strong>${p.result.fee}</strong>
            </div>
            <div>
              <small>{t(['Delivery', 'Entrega'])}</small>
              <strong>
                {p.result.days} {t(['days', 'días'])}
              </strong>
            </div>
            <p>
              {t(
                p.provider === 'stub'
                  ? [
                      'The stub always returns the same response, even when you change the weight.',
                      'El stub siempre devuelve la misma respuesta, aunque cambies el peso.',
                    ]
                  : [
                      'The checkout asked the injected service to quote this package.',
                      'El checkout le pidió al servicio inyectado que cotice este paquete.',
                    ],
              )}
            </p>
          </>
        ) : (
          <p>
            {t([
              'Calculate, switch services, and try again with the same package.',
              'Calculá, cambiá el servicio y probá otra vez con el mismo paquete.',
            ])}
          </p>
        )}
      </div>
    </ExperimentWorkbench>
  );
}
