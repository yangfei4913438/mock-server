import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useUserInfo from 'hooks/useUserInfo';
import { getArticle } from 'http/articles';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import Link from 'next/link';
import MDVideo from 'components/ui/markdown/video';
import MDImage from 'components/ui/markdown/image';
import MDPre from 'components/ui/markdown/pre';
import React, { DOMElement, FC } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { formatTime } from 'utils/times';
import rehypeHighlight from 'rehype-highlight';

const components = {
  nextLink: (props: {
    // 超链接
    href: string;
    // 自定义类名
    className?: string;
    // 是否当前页打开，默认当前页面打开
    self?: boolean;
    // title属性(seo权重1份)
    title?: string;
  }) => {
    return <Link {...props} />;
  },
  pre: (props: { className: string; children: DOMElement<any, any> }) => {
    return <MDPre className={props.className}>{props.children}</MDPre>;
  },
  Video: (props: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) => {
    return <MDVideo {...props} />;
  },
  Image: (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <MDImage {...props} />;
  },
};

interface IArticleDetail {
  id: string;
}

const ArticleDetail: FC<IArticleDetail> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [detail, setDetail] = useState<Article>();
  const [source, setSource] = useState<MDXRemoteSerializeResult>();

  const query = () => {
    let options = {};
    if (router.locale) {
      options = {
        ...options,
        locale: [router.locale === 'zh' ? 'zh-Hans' : 'en'],
      };
    }
    return getArticle(userInfo?.jwt!, id, options).then((res) => {
      // 本地更新
      setDetail(res);
      // 更新 markdown
      parseContent(res.content).then(setSource);
    });
  };

  useQuery(queryKeys.filterArticles({ id }), query, {
    // 存在令牌才可以发起查询
    enabled: !!userInfo?.jwt && !!id && router.isReady,
  });

  const parseContent = (content: string) => {
    return serialize(content, {
      mdxOptions: { rehypePlugins: [rehypeHighlight] },
    });
  };

  useEffect(() => {
    if (router && detail) {
      // 根据语言选出对应的内容
      const row = detail.locales.find((o) => o.locale === router.locale)!;
      if (row) {
        router.replace('/article/[id]', `/article/${row.id}`, { locale: router.locale });
      }
    }
  }, [detail, detail?.locales, router, router.locale]);

  return (
    <div className="flex w-full flex-1 justify-center overflow-auto p-8">
      <div className="prose prose-lg max-w-none">
        {detail && (
          <div className="space-y-2">
            <h2 className="!my-0 text-3xl font-bold dark:text-white">{detail.title}</h2>
            <p className="text-gray-5 hover:border-gray-7 space-x-4 text-base">
              <span>
                {t('updated')} {formatTime(detail.updatedAt)}
              </span>
              <span>
                {detail.categories.map((o) => (
                  <label className="badge badge-secondary" key={o.id}>
                    {o.name}
                  </label>
                ))}
              </span>
              <span className="space-x-1">
                {detail.tags.map((o) => (
                  <label className="badge badge-primary" key={o.id}>
                    {o.name}
                  </label>
                ))}
              </span>
            </p>
          </div>
        )}
        {source && (
          <article className="markdown-area">
            <MDXRemote {...source} components={components as any} lazy />
          </article>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
