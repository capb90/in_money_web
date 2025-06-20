import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

type TArgs = ({ [k: string]: any } | string)[] | { [k: string]: any };

@Injectable()
export class I18nAppService {
  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, args?: TArgs): Promise<string> {
    const ctx = I18nContext.current();
    return this.i18n.translate(key, {
      lang: ctx?.lang,
      args,
    });
  }

  async multiKeyTranslate(keys: string[]): Promise<string[]> {
    const ctx = I18nContext.current();
    const translates: Promise<string>[] = keys.map((key) =>
      this.i18n.translate(key, {
        lang: ctx?.lang,
      }),
    );

    return Promise.all(translates);
  }
}
