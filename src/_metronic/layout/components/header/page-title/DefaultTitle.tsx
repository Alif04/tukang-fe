import clsx from 'clsx'
import React, {FC} from 'react'
import {useLayout} from '../../../core/LayoutProvider'
import {usePageData} from '../../../core/PageData'

const DefaultTitle: FC = () => {
  const {pageTitle} = usePageData()
  const {classes} = useLayout()
  return (
    <div
      id='kt_page_title'
      // data-kt-swapper='true'
      // data-kt-swapper-mode='prepend'
      // data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx('page-title d-flex', classes.pageTitle.join(' '))}
    >
      {/* begin::Title */}
      {pageTitle && (
        <h1 className='d-flex align-items-center  text-light-md-black fw-bolder my-1 fs-1'>
          {pageTitle}

          {/* {pageDescription && config.pageTitle && config.pageTitle.description && (
            <>
              <span className='h-20px border-gray-200 border-start ms-3 mx-2'></span>
              <small className='text-black fs-7 fw-bold my-1 ms-1'>{pageDescription}</small>
            </>
          )} */}
        </h1>
      )}
      {/* end::Title */}

      {/* {pageBreadcrumbs &&
        pageBreadcrumbs.length > 0 &&
        config.pageTitle &&
        config.pageTitle.breadCrumbs && (
          <>
            {config.pageTitle.direction === 'row' && (
              <span className='h-20px border-gray-200 border-start mx-4'></span>
            )}
            <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1'>
              {Array.from(pageBreadcrumbs).map((item, index) => (
                <li
                  className={clsx('breadcrumb-item', {
                    'text-dark': !item.isSeparator && item.isActive,
                    'text-muted': !item.isSeparator && !item.isActive,
                  })}
                  key={`${item.path}${index}`}
                >
                  {!item.isSeparator ? (
                    <Link className='text-black text-hover-white' to={item.path}>
                      {item.title}
                    </Link>
                  ) : (
                    <span className='bullet bg-gray-200 w-5px h-2px'></span>
                  )}
                </li>
              ))}
              <li className='breadcrumb-item text-white'>{pageTitle}</li>
            </ul>
          </>
        )} */}
    </div>
  )
}

export {DefaultTitle}
