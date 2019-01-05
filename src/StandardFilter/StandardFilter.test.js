import React from 'react'
import { mount } from 'enzyme'
import StandardFilter from './index'

const fields = [
    {
        id: 'desc4',
        formItemOptions: {
          label: '描述',
        },
        options: {
          rules: [
            {
              required: true,
              message: 'aa'
            }
          ]
        }
      },
      {
        id: 'desc5',
        formItemOptions: {
          label: '描述',
        },
        options: {
          rules: [
            {
              required: true,
              message: 'aa'
            }
          ]
        }
      },
      {
        id: 'desc6',
        formItemOptions: {
          label: '描述',
        },
        options: {
          rules: [
            {
              required: true,
              message: 'aa'
            }
          ]
        }
      }
]
describe('test StandardFilter', () => {
    it('works', () => {
        const standardFilter = mount(<StandardFilter fields={[]} />)
        expect(standardFilter.find('.ant-btn').length).toEqual(2)
    });

    it('render with three form items', () => {
        const standardFilter = mount(<StandardFilter fields={fields} />)
        expect(standardFilter.find('.ant-form-item-control').length).toEqual(3)
    });

    it('simulates click events that validate fields', () => {
        const standardFilter = mount(<StandardFilter fields={fields} />)
        standardFilter.find('.ant-btn-primary').simulate('click')
        setTimeout(() => {
            expect(standardFilter.find('.ant-form-explain').length).toEqual(3)
        }, 300);
    })
});
