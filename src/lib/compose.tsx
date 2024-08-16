/* eslint-disable react/display-name */
import { ComponentProps, ComponentType, FC } from "react";

type Providers = [ComponentType<any>, ComponentProps<any>?][];

export const compose = (
  providers: Providers,
): FC<{ children?: React.ReactNode }> =>
  providers.reduce(
    (AccumulatedProviders, [Provider, props = {}]) =>
      ({ children }) => (
        <AccumulatedProviders>
          <Provider {...props}>
            <>{children}</>
          </Provider>
        </AccumulatedProviders>
      ),
    ({ children }) => <>{children}</>,
  );
